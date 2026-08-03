import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { customerSchema } from '@/lib/schemas/customer.schema';
import { serializeCustomer, toDBCustomerStatus } from '@/lib/serializers';

export async function GET() {
  const customers = await prisma.customer.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(customers.map(serializeCustomer));
}

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = customerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid customer data' },
      { status: 400 },
    );
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        status: toDBCustomerStatus(parsed.data.status),
      },
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
