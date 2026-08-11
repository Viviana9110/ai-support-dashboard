import { describe, expect, it } from 'vitest';

import {
  ticketSchema,
  ticketUpdateSchema,
} from '@/lib/schemas/ticket.schema';

const validTicket = {
  subject: 'Cannot reset password',
  customerId: 'b3c1e0e4-6c9f-4a3b-9e5a-123456789abc',
  status: 'Open',
  priority: 'Medium',
  agentId: 'f4d2a5b6-7d0e-4c1f-8a2b-9876543210fe',
} as const;

describe('ticketSchema', () => {
  it('parses a valid ticket', () => {
    const result = ticketSchema.safeParse(validTicket);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.subject).toBe(validTicket.subject);
      expect(result.data.status).toBe('Open');
      expect(result.data.priority).toBe('Medium');
      expect(result.data.agentId).toBe(validTicket.agentId);
    }
  });

  it('parses a ticket without an assigned agent', () => {
    const result = ticketSchema.safeParse({
      subject: validTicket.subject,
      customerId: validTicket.customerId,
      status: validTicket.status,
      priority: validTicket.priority,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.agentId).toBeUndefined();
    }
  });

  it('rejects a subject shorter than 3 characters', () => {
    const result = ticketSchema.safeParse({
      ...validTicket,
      subject: 'ab',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('subject');
    }
  });

  it('rejects a subject longer than 200 characters', () => {
    const result = ticketSchema.safeParse({
      ...validTicket,
      subject: 'a'.repeat(201),
    });

    expect(result.success).toBe(false);
  });

  it('rejects a non-uuid customerId', () => {
    const result = ticketSchema.safeParse({
      ...validTicket,
      customerId: 'not-a-uuid',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('customerId');
    }
  });

  it('rejects an invalid status and priority', () => {
    const badStatus = ticketSchema.safeParse({
      ...validTicket,
      status: 'Done',
    });

    expect(badStatus.success).toBe(false);

    const badPriority = ticketSchema.safeParse({
      ...validTicket,
      priority: 'Urgent',
    });

    expect(badPriority.success).toBe(false);
  });

  it('rejects an invalid agentId uuid', () => {
    const result = ticketSchema.safeParse({
      ...validTicket,
      agentId: 'not-a-uuid',
    });

    expect(result.success).toBe(false);
  });
});

describe('ticketUpdateSchema', () => {
  it('accepts an empty partial payload', () => {
    const result = ticketUpdateSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it('accepts a partial subject update', () => {
    const result = ticketUpdateSchema.safeParse({
      subject: 'New subject',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.subject).toBe('New subject');
    }
  });

  it('accepts agentId null and undefined', () => {
    expect(ticketUpdateSchema.safeParse({ agentId: null }).success).toBe(
      true,
    );
    expect(ticketUpdateSchema.safeParse({ agentId: undefined }).success).toBe(
      true,
    );
  });

  it('rejects an invalid agentId uuid', () => {
    const result = ticketUpdateSchema.safeParse({
      agentId: 'nope',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid enum value', () => {
    const result = ticketUpdateSchema.safeParse({
      status: 'Done',
    });

    expect(result.success).toBe(false);
  });
});
