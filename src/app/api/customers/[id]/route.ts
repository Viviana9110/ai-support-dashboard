import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { customerUpdateSchema } from '@/lib/schemas/customer.schema';
import { serializeCustomer, toDBCustomerStatus } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const customer = await prisma.customer.findUnique({
    where: { id, deletedAt: null },
  });

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeCustomer(customer));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const parsed = customerUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid customer data' },
      { status: 400 },
    );
  }

  try {
    const customer = await prisma.customer.update({
      where: { id, deletedAt: null },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.email !== undefined && { email: parsed.data.email }),
        ...(parsed.data.company !== undefined && {
          company: parsed.data.company,
        }),
        ...(parsed.data.status !== undefined && {
          status: toDBCustomerStatus(parsed.data.status),
        }),
      },
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
  const { id } = await context.params;

  try {
    const customer = await prisma.customer.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, id: customer.id });
  } catch (error) {
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
      { error: 'Failed to delete customer' },
      { status: 500 },
    );
  }
}
