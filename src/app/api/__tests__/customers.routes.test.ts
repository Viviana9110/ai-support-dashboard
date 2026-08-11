import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';

import {
  CUSTOMER_ID,
  SESSION_USER,
  cookieStore,
  asDb,
  dbActivityRow,
  dbCustomerRow,
  dbTicketRow,
  installTransactionMock,
  makeRequest,
  prismaError,
  routeContext,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

import { GET as listCustomers, POST as createCustomer } from '../customers/route';
import {
  GET as getCustomer,
  PATCH as updateCustomer,
  DELETE as deleteCustomer,
} from '../customers/[id]/route';
import { POST as restoreCustomer } from '../customers/[id]/restore/route';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('customers routes', () => {
  let db: DbMocks;

  beforeEach(async () => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
    installTransactionMock(db);
    await setSession(SESSION_USER);
  });

  describe('GET /api/customers', () => {
    it('returns the serialized customer list', async () => {
      db.customer.findMany.mockResolvedValue([dbCustomerRow()]);

      const response = await listCustomers();

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toHaveLength(1);
      expect(body[0]).toEqual({
        id: CUSTOMER_ID,
        name: 'Acme Inc',
        email: 'hello@acme.com',
        company: 'Acme Corp',
        status: 'Active',
      });
      expect(db.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { deletedAt: null } }),
      );
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await listCustomers();

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/customers', () => {
    it('creates a customer and writes an audit log', async () => {
      db.tx.customer.create.mockResolvedValue(dbCustomerRow());

      const response = await createCustomer(
        makeRequest('http://localhost/api/customers', {
          method: 'POST',
          body: {
            name: 'Acme Inc',
            email: 'hello@acme.com',
            company: 'Acme Corp',
            status: 'Active',
          },
        }),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({ name: 'Acme Inc' });

      expect(db.tx.customer.create).toHaveBeenCalledWith({
        data: {
          name: 'Acme Inc',
          email: 'hello@acme.com',
          company: 'Acme Corp',
          status: 'ACTIVE',
        },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entity: 'Customer',
          action: 'created',
          userId: SESSION_USER.sub,
        }),
      });
    });

    it('returns 400 when the email already exists (P2002)', async () => {
      db.tx.customer.create.mockRejectedValue(prismaError('P2002', 'Duplicate'));

      const response = await createCustomer(
        makeRequest('http://localhost/api/customers', {
          method: 'POST',
          body: {
            name: 'Acme Inc',
            email: 'hello@acme.com',
            company: 'Acme Corp',
            status: 'Active',
          },
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'A customer with this email already exists',
      });
    });

    it('rejects an invalid payload', async () => {
      const response = await createCustomer(
        makeRequest('http://localhost/api/customers', {
          method: 'POST',
          body: { name: 'x', email: 'not-an-email', company: 'A', status: 'Active' },
        }),
      );

      expect(response.status).toBe(400);
    });

    it('rejects an invalid JSON body', async () => {
      const response = await createCustomer(
        makeRequest('http://localhost/api/customers', {
          method: 'POST',
          body: '{invalid',
        }),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/customers/[id]', () => {
    it('returns the customer detail with tickets and activity', async () => {
      db.customer.findUnique.mockResolvedValue(dbCustomerRow());
      db.ticket.findMany.mockResolvedValue([dbTicketRow()]);
      db.auditLog.findMany.mockResolvedValue([dbActivityRow()]);

      const response = await getCustomer(
        new Request('http://localhost/api/customers/11111111-1111-4111-8111-111111111111'),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toMatchObject({
        id: CUSTOMER_ID,
        name: 'Acme Inc',
        status: 'Active',
        tickets: [{ id: 'ticket-1', subject: 'Cannot log in' }],
        activity: [{ id: 'log-1', action: 'created' }],
      });
      expect(db.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { customerId: CUSTOMER_ID, deletedAt: null } }),
      );
    });

    it('returns 404 for an invalid UUID', async () => {
      const response = await getCustomer(
        new Request('http://localhost/api/customers/not-a-uuid'),
        routeContext('not-a-uuid'),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Customer not found.' });
    });

    it('returns 404 when the customer is not found', async () => {
      db.customer.findUnique.mockResolvedValue(null);

      const response = await getCustomer(
        new Request('http://localhost/api/customers/11111111-1111-4111-8111-111111111111'),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/customers/[id]', () => {
    it('updates the name and writes an updated audit log', async () => {
      db.customer.findUnique.mockResolvedValue(dbCustomerRow());
      db.tx.customer.update.mockResolvedValue(
        dbCustomerRow({ name: 'Beta Inc', updatedAt: new Date() }),
      );

      const response = await updateCustomer(
        makeRequest('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'PATCH',
          body: { name: 'Beta Inc' },
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ name: 'Beta Inc' });

      expect(db.tx.customer.update).toHaveBeenCalledWith({
        where: { id: CUSTOMER_ID },
        data: { name: 'Beta Inc' },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'updated',
          metadata: { field: 'name', before: 'Acme Inc', after: 'Beta Inc' },
        }),
      });
    });

    it('updates the status with the DB value', async () => {
      db.customer.findUnique.mockResolvedValue(dbCustomerRow());
      db.tx.customer.update.mockResolvedValue(
        dbCustomerRow({ status: 'INACTIVE', updatedAt: new Date() }),
      );

      const response = await updateCustomer(
        makeRequest('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'PATCH',
          body: { status: 'Inactive' },
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(200);

      expect(db.tx.customer.update).toHaveBeenCalledWith({
        where: { id: CUSTOMER_ID },
        data: { status: 'INACTIVE' },
      });
    });

    it('returns the customer unchanged when nothing changes', async () => {
      db.customer.findUnique.mockResolvedValue(dbCustomerRow());

      const response = await updateCustomer(
        makeRequest('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'PATCH',
          body: { name: 'Acme Inc' },
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(200);
      expect(db.$transaction).not.toHaveBeenCalled();
    });

    it('returns 400 when the email already exists (P2002)', async () => {
      db.customer.findUnique.mockResolvedValue(dbCustomerRow());
      db.tx.customer.update.mockRejectedValue(prismaError('P2002', 'Duplicate'));

      const response = await updateCustomer(
        makeRequest('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'PATCH',
          body: { email: 'other@acme.com' },
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(400);
    });

    it('returns 404 when the customer is not found', async () => {
      db.customer.findUnique.mockResolvedValue(null);

      const response = await updateCustomer(
        makeRequest('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'PATCH',
          body: { name: 'Beta Inc' },
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(404);
    });

    it('rejects an invalid email', async () => {
      db.customer.findUnique.mockResolvedValue(dbCustomerRow());

      const response = await updateCustomer(
        makeRequest('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'PATCH',
          body: { email: 'not-an-email' },
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/customers/[id]', () => {
    it('soft deletes the customer and writes a deleted audit log', async () => {
      db.customer.findUnique.mockResolvedValue({
        id: CUSTOMER_ID,
        name: 'Acme Inc',
      });

      const response = await deleteCustomer(
        new Request('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'DELETE',
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true, id: CUSTOMER_ID });

      expect(db.tx.customer.update).toHaveBeenCalledWith({
        where: { id: CUSTOMER_ID },
        data: { deletedAt: expect.any(Date) },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'deleted' }),
      });
    });

    it('returns 404 when the customer is not found', async () => {
      db.customer.findUnique.mockResolvedValue(null);

      const response = await deleteCustomer(
        new Request('http://localhost/api/customers/11111111-1111-4111-8111-111111111111', {
          method: 'DELETE',
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/customers/[id]/restore', () => {
    it('restores the customer and writes a restored audit log', async () => {
      db.customer.findUnique.mockResolvedValue({ id: CUSTOMER_ID, name: 'Acme Inc' });
      db.tx.customer.update.mockResolvedValue(dbCustomerRow());

      const response = await restoreCustomer(
        new Request('http://localhost/api/customers/11111111-1111-4111-8111-111111111111/restore', {
          method: 'POST',
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ id: CUSTOMER_ID });

      expect(db.tx.customer.update).toHaveBeenCalledWith({
        where: { id: CUSTOMER_ID },
        data: { deletedAt: null },
      });

      expect(db.tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'restored' }),
      });
    });

    it('returns 404 when the customer is not found', async () => {
      db.customer.findUnique.mockResolvedValue(null);

      const response = await restoreCustomer(
        new Request('http://localhost/api/customers/11111111-1111-4111-8111-111111111111/restore', {
          method: 'POST',
        }),
        routeContext(CUSTOMER_ID),
      );

      expect(response.status).toBe(404);
    });
  });
});
