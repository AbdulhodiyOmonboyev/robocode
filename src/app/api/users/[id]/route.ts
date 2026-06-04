import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "OPERATOR"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
  canManageLeads: z.boolean().optional(),
  canManageCourses: z.boolean().optional(),
  canManageUsers: z.boolean().optional(),
  canViewReports: z.boolean().optional(),
  canExportData: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as any;
  if (!["SUPER_ADMIN", "ADMIN"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { password, email, ...rest } = parsed.data;
  const updateData: any = { ...rest };
  if (email !== undefined) updateData.email = email || null;
  if (password) updateData.passwordHash = await bcrypt.hash(password, 12);

  const updated = await db.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true, fullName: true, username: true, email: true, role: true, isActive: true,
      canManageLeads: true, canManageCourses: true, canManageUsers: true,
      canViewReports: true, canExportData: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as any;
  if (currentUser.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === currentUser.id) {
    return NextResponse.json({ error: "O'zingizni o'chira olmaysiz" }, { status: 400 });
  }

  await db.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
