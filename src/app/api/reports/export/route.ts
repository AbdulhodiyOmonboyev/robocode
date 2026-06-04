import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { name: true } },
      timeSlot: { select: { label: true } },
      assignedTo: { select: { fullName: true } },
    },
  });

  const headers = ["ID","Ism","Telefon","Email","Yoshi","Kurs","Vaqt sloti","Holat","Manba","Mas'ul","Qo'shilgan","Yozilgan sana"];
  const rows = leads.map(l => [
    l.id, l.fullName, l.phone, l.email||"", l.age||"",
    l.course?.name||"", l.timeSlot?.label||"",
    l.status, l.source, l.assignedTo?.fullName||"",
    format(l.createdAt, "dd.MM.yyyy HH:mm"),
    l.enrolledAt ? format(l.enrolledAt, "dd.MM.yyyy") : "",
  ]);

  const csv = [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads_${format(new Date(),"yyyyMMdd")}.csv"`,
    },
  });
}
