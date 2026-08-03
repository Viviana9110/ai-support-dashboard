import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeCustomer } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const existing = await prisma.customer.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Customer not found.' },
      { status: 404 },
    );
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: { deletedAt: null },
  });

  return NextResponse.json(serializeCustomer(customer));
}
