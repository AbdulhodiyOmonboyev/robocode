import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Nom kiriting"),
  courseId: z.string().optional().nullable(),
  teacherId: z.string().optional().nullable(),
  days: z.string().optional().nullable(),
  timeFrom: z.string().optional().nullable(),
  timeTo: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await db.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { id: true, name: true, color: true } },
      teacher: { select: { id: true, fullName: true } },
      _count: { select: { leads: true } },
    },
  });
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const group = await db.group.create({
    data: {
      name: d.name,
      courseId: d.courseId || null,
      teacherId: d.teacherId || null,
      days: d.days || null,
      timeFrom: d.timeFrom || null,
      timeTo: d.timeTo || null,
      startDate: d.startDate ? new Date(d.startDate) : null,
    },
  });
  return NextResponse.json(group, { status: 201 });
}
