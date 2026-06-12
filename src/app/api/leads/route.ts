import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

const createSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 harf"),
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
  phoneSecondary: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  age: z.coerce.number().int().min(5).max(99).optional().nullable(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  courseId: z.string().optional().nullable(),
  timeSlotId: z.string().optional().nullable(),
  timePreference: z.enum(["MORNING","AFTERNOON","EVENING","FLEXIBLE"]).default("FLEXIBLE"),
  preferredDays: z.string().optional(),
  lessonTime: z.string().optional(),
  stageId: z.string().optional().nullable(),
  status: z.enum(["NEW","CONTACTED","INTERESTED","TRIAL_BOOKED","TRIAL_COMPLETED","ENROLLED","POSTPONED","LOST"]).default("NEW"),
  source: z.enum(["INSTAGRAM","TELEGRAM","FACEBOOK","TIKTOK","REFERRAL","WEBSITE","WALK_IN","PHONE_CALL","OTHER"]).default("OTHER"),
  sourceDetails: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
  trialDate: z.string().optional().nullable(),
  reminderAt: z.string().optional().nullable(),
  reminderTitle: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const courseId = searchParams.get("courseId") || "";
  const assignedToId = searchParams.get("assignedToId") || "";
  const source = searchParams.get("source") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const timePreference = searchParams.get("timePreference") || "";

  const where: Prisma.LeadWhereInput = {};

  // archived / frozen filters
  where.isArchived = searchParams.get("archived") === "1";
  if (searchParams.get("frozen") === "1") where.frozenAt = { not: null };

  // OPERATOR can only see own leads
  if (user.role === "OPERATOR") {
    where.assignedToId = user.id;
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) where.status = status as any;
  const stageId = searchParams.get("stageId") || "";
  if (stageId) where.stageId = stageId;
  if (courseId) where.courseId = courseId;
  if (source) where.source = source as any;
  if (timePreference) where.timePreference = timePreference as any;

  if (assignedToId === "unassigned") {
    where.assignedToId = null;
  } else if (assignedToId) {
    where.assignedToId = assignedToId;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as any).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as any).lte = new Date(dateTo + "T23:59:59");
  }

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, name: true, color: true } },
        timeSlot: { select: { id: true, label: true } },
        stage: { select: { id: true, name: true, color: true } },
        group: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        tags: { select: { id: true, name: true, color: true } },
        _count: { select: { reminders: true } },
      },
    }),
    db.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Check duplicate phone
  const existing = await db.lead.findFirst({ where: { phone: parsed.data.phone } });
  if (existing) {
    return NextResponse.json({ error: "duplicate", message: "Bu telefon raqam allaqachon mavjud", leadId: existing.id }, { status: 409 });
  }

  const { reminderAt, reminderTitle, trialDate, age, courseId, timeSlotId, assignedToId, stageId, ...rest } = parsed.data;

  // Default to the first stage if none chosen
  let finalStageId = stageId || null;
  if (!finalStageId) {
    const firstStage = await db.stage.findFirst({ orderBy: { order: "asc" } });
    finalStageId = firstStage?.id ?? null;
  }

  const lead = await db.lead.create({
    data: {
      ...rest,
      age: age ?? null,
      courseId: courseId || null,
      timeSlotId: timeSlotId || null,
      assignedToId: assignedToId || null,
      stageId: finalStageId,
      trialDate: trialDate ? new Date(trialDate) : null,
      createdById: user.id,
    },
  });

  // Log activity
  await db.activity.create({
    data: { leadId: lead.id, userId: user.id, action: "lead_created", details: { status: lead.status } },
  });

  // Create reminder if set
  if (reminderAt) {
    await db.reminder.create({
      data: {
        leadId: lead.id,
        userId: user.id,
        title: reminderTitle || "Qo'ng'iroq qilish",
        remindAt: new Date(reminderAt),
      },
    });
  }

  return NextResponse.json(lead, { status: 201 });
}
