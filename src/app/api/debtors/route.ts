import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDebtors } from "@/lib/debtors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  const result = await getDebtors(month);
  return NextResponse.json(result);
}
