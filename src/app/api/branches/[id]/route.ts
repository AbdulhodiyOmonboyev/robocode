import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Session } from "next-auth";

function admin(s: Session | null) { return s && ["SUPER_ADMIN", "ADMIN"].includes(s.user.role); }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!admin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const data: { name?: string; address?: string | null; phone?: string | null; isActive?: boolean } = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.address === "string" || body.address === null) data.address = body.address?.trim() || null;
  if (typeof body.phone === "string" || body.phone === null) data.phone = body.phone?.trim() || null;
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  const b = await db.branch.update({ where: { id }, data });
  return NextResponse.json(b);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!admin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await db.branch.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
