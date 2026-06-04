import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  phoneSecondary: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  age: z.coerce.number().int().optional().nullable(),
  address: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  timeSlotId: z.string().optional().nullable(),
  timePreference: z.enum(["MORNING","AFTERNOON","EVENING","FLEXIBLE"]).optional(),
  preferredDays: z.string().optional().nullable(),
  status: z.enum(["NEW","CONTACTED","INTERESTED","TRIAL_BOOKED","TRIAL_COMPLETED","ENROLLED","POSTPONED","LOST"]).optional(),
  source: z.enum(["INSTAGRAM","TELEGRAM","FACEBOOK","TIKTOK","REFERRAL","WEBSITE","WALK_IN","PHONE_CALL","OTHER"]).optional(),
  sourceDetails: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  trialDate: z.string().optional().nullable(),
  enrolledAt: z.string().optional().nullable(),
  lastContactedAt: z.string().optional().nullable(),
  isPinned: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      course: true,
      timeSlot: true,
      assignedTo: { select: { id: true, fullName: true, username: true } },
      createdBy: { select: { id: true, fullName: true } },
      tags: true,
      reminders: { orderBy: { remindAt: "asc" }, include: { user: { select: { fullName: true } } } },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { id: true, fullName: true } } },
      },
    },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = session.user as any;
  const current = await db.lead.findUnique({ where: { id }, select: { status: true, assignedToId: true } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { trialDate, enrolledAt, lastContactedAt, ...rest } = parsed.data;
  const updateData: any = { ...rest };
  if (trialDate !== undefined) updateData.trialDate = trialDate ? new Date(trialDate) : null;
  if (enrolledAt !== undefined) updateData.enrolledAt = enrolledAt ? new Date(enrolledAt) : null;
  if (lastContactedAt !== undefined) updateData.lastContactedAt = lastContactedAt ? new Date(lastContactedAt) : null;

  // Auto-set enrolledAt when status changes to ENROLLED
  if (parsed.data.status === "ENROLLED" && current.status !== "ENROLLED") {
    updateData.enrolledAt = new Date();
  }

  const updated = await db.lead.update({ where: { id }, data: updateData });

  // Log activity
  const details: any = {};
  if (parsed.data.status && parsed.data.status !== current.status) {
    details.from = current.status; details.to = parsed.data.status;
    await db.activity.create({ data: { leadId: id, userId: user.id, action: "status_changed", details } });
  } else {
    await db.activity.create({ data: { leadId: id, userId: user.id, action: "lead_updated" } });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await db.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
