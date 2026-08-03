import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeCustomer, toDBCustomerStatus } from '@/lib/serializers';

import type { CustomerStatus } from '@/services/customers/customers.types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeCustomer(customer));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.status !== undefined && {
        status: toDBCustomerStatus(body.status as CustomerStatus),
      }),
    },
  });

  return NextResponse.json(serializeCustomer(customer));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  await prisma.customer.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
