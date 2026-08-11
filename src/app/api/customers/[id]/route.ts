import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { getActorId, writeAuditLog } from '@/lib/audit';
import { customerUpdateSchema } from '@/lib/schemas/customer.schema';
import {
  serializeCustomer,
  serializeCustomerDetail,
  toDBCustomerStatus,
} from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  const [customer, tickets, activity] = await Promise.all([
    prisma.customer.findUnique({
      where: { id, deletedAt: null },
    }),
    prisma.ticket.findMany({
      where: { customerId: id, deletedAt: null },
      include: { customer: true, agent: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.auditLog.findMany({
      where: { entity: 'Customer', entityId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  return NextResponse.json(
    serializeCustomerDetail(customer, tickets, activity),
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = customerUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid customer data' },
      { status: 400 },
    );
  }

  const existing = await prisma.customer.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  const data = parsed.data;

  const nameChanged = data.name !== undefined && data.name !== existing.name;

  const emailChanged =
    data.email !== undefined && data.email !== existing.email;

  const companyChanged =
    data.company !== undefined && data.company !== existing.company;

  const statusAfter =
    data.status !== undefined ? toDBCustomerStatus(data.status) : existing.status;

  const statusChanged = statusAfter !== existing.status;

  const hasChanges =
    nameChanged || emailChanged || companyChanged || statusChanged;

  if (!hasChanges) {
    return NextResponse.json(serializeCustomer(existing));
  }

  try {
    const customer = await prisma.$transaction(async (tx) => {
      const updated = await tx.customer.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.email !== undefined && { email: data.email }),
          ...(data.company !== undefined && { company: data.company }),
          ...(data.status !== undefined && { status: statusAfter }),
        },
      });

      const actorId = await getActorId();

      if (nameChanged) {
        await writeAuditLog(tx, {
          entity: 'Customer',
          entityId: updated.id,
          action: 'updated',
          userId: actorId,
          metadata: {
            field: 'name',
            before: existing.name,
            after: data.name,
          },
        });
      }

      if (emailChanged) {
        await writeAuditLog(tx, {
          entity: 'Customer',
          entityId: updated.id,
          action: 'updated',
          userId: actorId,
          metadata: {
            field: 'email',
            before: existing.email,
            after: data.email,
          },
        });
      }

      if (companyChanged) {
        await writeAuditLog(tx, {
          entity: 'Customer',
          entityId: updated.id,
          action: 'updated',
          userId: actorId,
          metadata: {
            field: 'company',
            before: existing.company,
            after: data.company,
          },
        });
      }

      if (statusChanged) {
        await writeAuditLog(tx, {
          entity: 'Customer',
          entityId: updated.id,
          action: 'updated',
          userId: actorId,
          metadata: {
            field: 'status',
            before: existing.status,
            after: statusAfter,
          },
        });
      }

      return updated;
    });

    return NextResponse.json(serializeCustomer(customer));
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Customer not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const existing = await prisma.customer.findUnique({
    where: { id, deletedAt: null },
    select: { id: true, name: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  const actorId = await getActorId();
  const deletedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.customer.update({
      where: { id },
      data: { deletedAt },
    });

    await writeAuditLog(tx, {
      entity: 'Customer',
      entityId: id,
      action: 'deleted',
      userId: actorId,
      metadata: {
        name: existing.name,
        deletedAt: deletedAt.toISOString(),
      },
    });
  });

  return NextResponse.json({ success: true, id: existing.id });
}
