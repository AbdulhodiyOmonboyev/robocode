import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 harf"),
  username: z.string().min(3, "Username kamida 3 harf").regex(/^[a-z0-9_]+$/, "Faqat kichik harf, raqam va _"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  password: z.string().min(8, "Parol kamida 8 ta belgi"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "OPERATOR", "RECEPTION", "ACCOUNTANT"]),
  canManageLeads: z.boolean().default(true),
  canManageCourses: z.boolean().default(false),
  canManageUsers: z.boolean().default(false),
  canViewReports: z.boolean().default(false),
  canExportData: z.boolean().default(false),
  canSeePayments: z.boolean().default(false),
  canManagePayments: z.boolean().default(false),
  canSeeStudentContacts: z.boolean().default(true),
  canManageAttendance: z.boolean().default(false),
  canManageGrades: z.boolean().default(false),
  canSeeReports: z.boolean().default(false),
  canManageExpenses: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, fullName: true, username: true, email: true, phone: true,
      role: true, isActive: true, avatarUrl: true, createdAt: true, lastLoginAt: true,
      canManageLeads: true, canManageCourses: true, canManageUsers: true,
      canViewReports: true, canExportData: true,
      canSeePayments: true, canManagePayments: true, canSeeStudentContacts: true,
      canManageAttendance: true, canManageGrades: true, canSeeReports: true,
      canManageExpenses: true,
      _count: { select: { leads: true } },
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user;
  if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { password, email, ...rest } = parsed.data;

  const existing = await db.user.findUnique({ where: { username: rest.username } });
  if (existing) {
    return NextResponse.json({ error: "Bu username band" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await db.user.create({
    data: {
      ...rest,
      email: email || null,
      passwordHash,
    },
    select: {
      id: true, fullName: true, username: true, email: true, role: true, isActive: true,
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
