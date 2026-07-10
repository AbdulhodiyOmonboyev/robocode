import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "OPERATOR"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
  oldPassword: z.string().optional(),
  canManageLeads: z.boolean().optional(),
  canManageCourses: z.boolean().optional(),
  canManageUsers: z.boolean().optional(),
  canViewReports: z.boolean().optional(),
  canExportData: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user;
  const { id } = await params;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(currentUser.role);
  const isSelf = currentUser.id === id;
  if (!isAdmin && !isSelf) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { password, oldPassword, email, avatarUrl, role, isActive, canManageLeads, canManageCourses, canManageUsers, canViewReports, canExportData, ...rest } = parsed.data;
  const updateData: Prisma.UserUpdateInput = { ...rest };
  if (email !== undefined) updateData.email = email || null;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null;

  // Only admins may change role, active status, and permissions
  if (isAdmin) {
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (canManageLeads !== undefined) updateData.canManageLeads = canManageLeads;
    if (canManageCourses !== undefined) updateData.canManageCourses = canManageCourses;
    if (canManageUsers !== undefined) updateData.canManageUsers = canManageUsers;
    if (canViewReports !== undefined) updateData.canViewReports = canViewReports;
    if (canExportData !== undefined) updateData.canExportData = canExportData;
  }

  if (password) {
    // Self-service password change requires verifying the current password
    if (isSelf) {
      if (!oldPassword) {
        return NextResponse.json({ error: "Eski parolni kiriting" }, { status: 400 });
      }
      const existing = await db.user.findUnique({ where: { id }, select: { passwordHash: true } });
      if (!existing || !(await bcrypt.compare(oldPassword, existing.passwordHash))) {
        return NextResponse.json({ error: "Eski parol noto'g'ri" }, { status: 400 });
      }
    }
    updateData.passwordHash = await bcrypt.hash(password, 12);
  }

  const updated = await db.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true, fullName: true, username: true, email: true, avatarUrl: true, role: true, isActive: true,
      canManageLeads: true, canManageCourses: true, canManageUsers: true,
      canViewReports: true, canExportData: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user;
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
