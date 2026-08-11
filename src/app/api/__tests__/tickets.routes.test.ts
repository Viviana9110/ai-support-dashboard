import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';

import {
  AGENT_ID,
  CUSTOMER_ID,
  NEW_CUSTOMER_ID,
  SESSION_USER,
  cookieStore,
  asDb,
  dbTicketRow,
  installTransactionMock,
  makeRequest,
  prismaError,
  routeContext,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

import { GET as listTickets, POST as createTicket } from '../tickets/route';
import {
  GET as getTicket,
  PATCH as updateTicket,
  DELETE as deleteTicket,
} from '../tickets/[id]/route';
import { POST as restoreTicket } from '../tickets/[id]/restore/route';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('tickets routes', () => {
  let db: DbMocks;

  beforeEach(async () => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
    installTransactionMock(db);
    await setSession(SESSION_USER);
  });

  describe('GET /api/tickets', () => {
    it('returns the serialized ticket list', async () => {
      db.ticket.findMany.mockResolvedValue([
        dbTicketRow(),
        dbTicketRow({
          id: 'ticket-2',
          subject: 'Billing question',
          status: 'PENDING',
          priority: 'MEDIUM',
          agent: null,
        }),
      ]);

      const response = await listTickets();

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toHaveLength(2);
      expect(body[0]).toMatchObject({
        id: 'ticket-1',
        customer: 'Acme Inc',
        customerId: CUSTOMER_ID,
        subject: 'Cannot log in',
        status: 'Open',
        priority: 'High',
        agent: 'Viviana',
        agentId: AGENT_ID,
      });
      expect(body[0]).not.toHaveProperty('deletedAt');
      expect(body[1].agent).toBe('');
      expect(body[1].agentId).toBeNull();
      expect(db.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { deletedAt: null } }),
      );
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await listTickets();

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized.' });
    });
  });

  describe('POST /api/tickets', () => {
    it('creates a ticket and writes an audit log', async () => {
      db.tx.ticket.create.mockResolvedValue(dbTicketRow());

      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: {
            subject: 'Cannot log in',
            customerId: CUSTOMER_ID,
            status: 'Open',
            priority: 'High',
            agentId: AGENT_ID,
          },
        }),
      );

      expect(response.status).toBe(201);

      const body = await response.json();

      expect(body).toMatchObject({
        id: 'ticket-1',
        subject: 'Cannot log in',
        status: 'Open',
      });

      expect(db.tx.ticket.create).toHaveBeenCalledWith({
        data: {
          subject: 'Cannot log in',
          status: 'OPEN',
          priority: 'HIGH',
          customerId: CUSTOMER_ID,
          agentId: AGENT_ID,
          createdById: SESSION_USER.sub,
        },
        include: { customer: true, agent: true },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entity: 'Ticket',
          entityId: 'ticket-1',
          action: 'created',
          userId: SESSION_USER.sub,
        }),
      });
    });

    it('creates a ticket without an agent', async () => {
      db.tx.ticket.create.mockResolvedValue(dbTicketRow());

      await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: {
            subject: 'Cannot log in',
            customerId: CUSTOMER_ID,
            status: 'Open',
            priority: 'Low',
          },
        }),
      );

      expect(db.tx.ticket.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ agentId: null }) }),
      );
    });

    it('rejects an invalid payload', async () => {
      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: { subject: 'x', customerId: 'not-a-uuid' },
        }),
      );

      expect(response.status).toBe(400);
    });

    it('rejects an invalid JSON body', async () => {
      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: '{invalid',
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid JSON body.' });
    });

    it('returns 400 when the customer does not exist (P2003)', async () => {
      db.tx.ticket.create.mockRejectedValue(prismaError('P2003', 'FK failed'));

      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: {
            subject: 'Cannot log in',
            customerId: NEW_CUSTOMER_ID,
            status: 'Open',
            priority: 'High',
          },
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'The selected customer does not exist.',
      });
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: {
            subject: 'Cannot log in',
            customerId: CUSTOMER_ID,
            status: 'Open',
            priority: 'High',
          },
        }),
      );

      expect(response.status).toBe(401);
    });

    it('uses the session user as the actor and never another DB user', async () => {
      db.user.findFirst.mockResolvedValue({ id: 'first-user-in-db' });
      db.tx.ticket.create.mockResolvedValue(dbTicketRow());

      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: {
            subject: 'Cannot log in',
            customerId: CUSTOMER_ID,
            status: 'Open',
            priority: 'High',
            agentId: AGENT_ID,
          },
        }),
      );

      expect(response.status).toBe(201);

      expect(db.tx.ticket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ createdById: SESSION_USER.sub }),
        }),
      );

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: SESSION_USER.sub }),
      });

      expect(db.user.findFirst).not.toHaveBeenCalled();
    });

    it('rejects without a session without consulting any fallback actor', async () => {
      cookieStore.clear();
      db.user.findFirst.mockResolvedValue({ id: 'first-user-in-db' });

      const response = await createTicket(
        makeRequest('http://localhost/api/tickets', {
          method: 'POST',
          body: {
            subject: 'Cannot log in',
            customerId: CUSTOMER_ID,
            status: 'Open',
            priority: 'High',
          },
        }),
      );

      expect(response.status).toBe(401);
      expect(db.user.findFirst).not.toHaveBeenCalled();
      expect(db.tx.ticket.create).not.toHaveBeenCalled();
      expect(db.tx.auditLog.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/tickets/[id]', () => {
    it('returns the ticket detail with activity', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());
      db.auditLog.findMany.mockResolvedValue([
        { id: 'log-1', action: 'created', metadata: null, createdAt: new Date(), user: { name: 'Viviana' } },
      ]);

      const response = await getTicket(
        new Request('http://localhost/api/tickets/ticket-1'),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toMatchObject({
        id: 'ticket-1',
        subject: 'Cannot log in',
        activity: [{ id: 'log-1', action: 'created', user: 'Viviana' }],
      });
      expect(db.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { entity: 'Ticket', entityId: 'ticket-1' } }),
      );
    });

    it('returns 404 when the ticket is not found', async () => {
      db.ticket.findUnique.mockResolvedValue(null);

      const response = await getTicket(
        new Request('http://localhost/api/tickets/unknown'),
        routeContext('unknown'),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Ticket not found.' });
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await getTicket(
        new Request('http://localhost/api/tickets/ticket-1'),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/tickets/[id]', () => {
    it('updates the status and writes a status_changed audit log', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());
      db.tx.ticket.update.mockResolvedValue(
        dbTicketRow({ status: 'PENDING', updatedAt: new Date() }),
      );

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { status: 'Pending' },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body.status).toBe('Pending');

      expect(db.tx.ticket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { status: 'PENDING' },
        include: { customer: true, agent: true },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'status_changed',
          metadata: { field: 'status', before: 'Open', after: 'Pending' },
        }),
      });
    });

    it('updates the subject and writes an updated audit log', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());
      db.tx.ticket.update.mockResolvedValue(
        dbTicketRow({ subject: 'Login help', updatedAt: new Date() }),
      );

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { subject: 'Login help' },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'updated',
          metadata: {
            field: 'subject',
            before: 'Cannot log in',
            after: 'Login help',
          },
        }),
      });
    });

    it('unassigns the agent and writes an agent_changed audit log', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());
      db.tx.ticket.update.mockResolvedValue(
        dbTicketRow({ agent: null, updatedAt: new Date() }),
      );

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { agentId: null },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);

      expect(db.tx.ticket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { agentId: null },
        include: { customer: true, agent: true },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'agent_changed',
          metadata: {
            field: 'agent',
            before: { id: AGENT_ID, name: 'Viviana' },
            after: null,
          },
        }),
      });
    });

    it('reassigns the customer and writes a customer_changed audit log', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());
      db.tx.ticket.update.mockResolvedValue(
        dbTicketRow({ customer: { id: NEW_CUSTOMER_ID, name: 'Beta Inc' } }),
      );
      db.tx.customer.findUnique.mockResolvedValue({ name: 'Beta Inc' });

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { customerId: NEW_CUSTOMER_ID },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);

      expect(db.tx.customer.findUnique).toHaveBeenCalledWith({
        where: { id: NEW_CUSTOMER_ID },
        select: { name: true },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'customer_changed',
          metadata: {
            field: 'customer',
            before: { id: CUSTOMER_ID, name: 'Acme Inc' },
            after: { id: NEW_CUSTOMER_ID, name: 'Beta Inc' },
          },
        }),
      });
    });

    it('returns the ticket unchanged when nothing changes', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { subject: 'Cannot log in' },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ subject: 'Cannot log in' });
      expect(db.$transaction).not.toHaveBeenCalled();
    });

    it('returns 404 when the ticket is not found', async () => {
      db.ticket.findUnique.mockResolvedValue(null);

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { status: 'Pending' },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(404);
    });

    it('rejects an invalid payload', async () => {
      db.ticket.findUnique.mockResolvedValue(dbTicketRow());

      const response = await updateTicket(
        makeRequest('http://localhost/api/tickets/ticket-1', {
          method: 'PATCH',
          body: { status: 'Nope' },
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/tickets/[id]', () => {
    it('soft deletes the ticket and writes a deleted audit log', async () => {
      db.ticket.findUnique.mockResolvedValue({
        id: 'ticket-1',
        deletedAt: null,
        subject: 'Cannot log in',
      });

      const response = await deleteTicket(
        new Request('http://localhost/api/tickets/ticket-1', { method: 'DELETE' }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });

      expect(db.tx.ticket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { deletedAt: expect.any(Date) },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'deleted',
          metadata: expect.objectContaining({ subject: 'Cannot log in' }),
        }),
      });
    });

    it('returns 404 when the ticket is already deleted', async () => {
      db.ticket.findUnique.mockResolvedValue({
        id: 'ticket-1',
        deletedAt: new Date(),
        subject: 'Cannot log in',
      });

      const response = await deleteTicket(
        new Request('http://localhost/api/tickets/ticket-1', { method: 'DELETE' }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 when the ticket does not exist', async () => {
      db.ticket.findUnique.mockResolvedValue(null);

      const response = await deleteTicket(
        new Request('http://localhost/api/tickets/unknown', { method: 'DELETE' }),
        routeContext('unknown'),
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/tickets/[id]/restore', () => {
    it('restores the ticket and writes a restored audit log', async () => {
      db.ticket.findUnique.mockResolvedValue({ id: 'ticket-1' });
      db.tx.ticket.update.mockResolvedValue(dbTicketRow());

      const response = await restoreTicket(
        new Request('http://localhost/api/tickets/ticket-1/restore', {
          method: 'POST',
        }),
        routeContext('ticket-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ id: 'ticket-1' });

      expect(db.tx.ticket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { deletedAt: null },
        include: { customer: true, agent: true },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'restored' }),
      });
    });

    it('returns 404 when the ticket does not exist', async () => {
      db.ticket.findUnique.mockResolvedValue(null);

      const response = await restoreTicket(
        new Request('http://localhost/api/tickets/unknown/restore', {
          method: 'POST',
        }),
        routeContext('unknown'),
      );

      expect(response.status).toBe(404);
    });
  });
});
