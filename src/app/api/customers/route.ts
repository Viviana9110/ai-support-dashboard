import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeCustomer, toDBCustomerStatus } from '@/lib/serializers';

import type { CustomerStatus } from '@/services/customers/customers.types';

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(customers.map(serializeCustomer));
}

export async function POST(request: Request) {
  const body = await request.json();

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      email: body.email,
      company: body.company,
      status: body.status
        ? toDBCustomerStatus(body.status as CustomerStatus)
        : 'ACTIVE',
    },
  });

  return NextResponse.json(serializeCustomer(customer), { status: 201 });
}
