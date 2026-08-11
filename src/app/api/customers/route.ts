import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { getActorId, writeAuditLog } from '@/lib/audit';
import { customerSchema } from '@/lib/schemas/customer.schema';
import { serializeCustomer, toDBCustomerStatus } from '@/lib/serializers';

export async function GET() {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const customers = await prisma.customer.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(customers.map(serializeCustomer));
}

export async function POST(request: Request) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = customerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid customer data' },
      { status: 400 },
    );
  }

  const actorId = await getActorId();

  if (!actorId) {
    return NextResponse.json(
      { error: 'No user available to create the customer.' },
      { status: 401 },
    );
  }

  const data = parsed.data;

  try {
    const customer = await prisma.$transaction(async (tx) => {
      const created = await tx.customer.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company,
          status: toDBCustomerStatus(data.status),
        },
      });

      await writeAuditLog(tx, {
        entity: 'Customer',
        entityId: created.id,
        action: 'created',
        userId: actorId,
        metadata: {
          name: created.name,
          email: created.email,
          company: created.company,
          status: created.status,
        },
      });

      return created;
    });

    return NextResponse.json(serializeCustomer(customer), { status: 201 });
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

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 },
    );
  }
}
