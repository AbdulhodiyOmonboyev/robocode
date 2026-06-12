import { db } from "@/lib/db";

// Fire-and-forget audit logger. Never throws.
export async function logAudit(
  userId: string,
  userName: string | undefined,
  action: string,
  entity: string,
  entityId?: string,
  details?: any
) {
  try {
    await db.auditLog.create({
      data: {
        userId,
        userName: userName || null,
        action,
        entity,
        entityId: entityId || null,
        details: details ?? undefined,
      },
    });
  } catch {
    // ignore audit failures
  }
}
