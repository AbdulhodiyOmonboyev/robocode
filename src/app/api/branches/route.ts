import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const branches = await db.branch.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(branches);
}

const schema = z.object({
  name: z.string().min(1, "Nom kiriting"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const b = await db.branch.create({
    data: {
      name: parsed.data.name.trim(),
      address: parsed.data.address?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
    },
  });
  return NextResponse.json(b, { status: 201 });
}
