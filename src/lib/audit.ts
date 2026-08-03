import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Prisma } from '@/generated/prisma/client';

export type TicketAuditAction =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'priority_changed'
  | 'customer_changed'
  | 'agent_changed'
  | 'deleted'
  | 'restored';

export interface AuditLogInput {
  entity: string;
  entityId: string;
  action: TicketAuditAction;
  userId: string | null;
  metadata?: Prisma.InputJsonValue;
}

export async function getActorId(): Promise<string | null> {
  const session = await getSession();

  if (session?.sub) return session.sub;

  const fallback = await prisma.user.findFirst({
    select: { id: true },
  });

  return fallback?.id ?? null;
}

export function writeAuditLog(
  db: Prisma.TransactionClient,
  entry: AuditLogInput,
) {
  return db.auditLog.create({
    data: {
      entity: entry.entity,
      entityId: entry.entityId,
      action: entry.action,
      metadata: entry.metadata ?? undefined,
      userId: entry.userId,
    },
  });
}
