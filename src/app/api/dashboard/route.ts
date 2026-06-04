import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfMonth, startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);

  const [
    totalLeads,
    todayLeads,
    enrolledThisMonth,
    todayReminders,
    statusDistribution,
    sourceDistribution,
    leadsByDay,
    topCourses,
    recentLeads,
    recentActivities,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    db.lead.count({ where: { status: "ENROLLED", enrolledAt: { gte: monthStart } } }),
    db.reminder.count({
      where: { status: "PENDING", remindAt: { gte: todayStart, lte: todayEnd } },
    }),
    db.lead.groupBy({ by: ["status"], _count: { id: true } }),
    db.lead.groupBy({ by: ["source"], _count: { id: true } }),
    Promise.all(
      Array.from({ length: 30 }, (_, i) => {
        const day = subDays(now, 29 - i);
        return db.lead
          .count({ where: { createdAt: { gte: startOfDay(day), lte: endOfDay(day) } } })
          .then((count) => ({ date: format(day, "MM/dd"), count }));
      })
    ),
    db.lead.groupBy({
      by: ["courseId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
      where: { courseId: { not: null } },
    }),
    db.lead.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { course: { select: { name: true, color: true } }, assignedTo: { select: { fullName: true } } },
    }),
    db.activity.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true } }, lead: { select: { fullName: true } } },
    }),
  ]);

  // Course details for topCourses
  const courseIds = topCourses.map((c) => c.courseId).filter(Boolean) as string[];
  const courses = await db.course.findMany({
    where: { id: { in: courseIds } },
    select: { id: true, name: true, color: true },
  });
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));

  const totalConverted = statusDistribution.find((s) => s.status === "ENROLLED")?._count?.id ?? 0;
  const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : "0";

  return NextResponse.json({
    kpis: {
      totalLeads,
      todayLeads,
      enrolledThisMonth,
      todayReminders,
      conversionRate,
    },
    statusDistribution: statusDistribution.map((s) => ({ status: s.status, count: s._count.id })),
    sourceDistribution: sourceDistribution.map((s) => ({ source: s.source, count: s._count.id })),
    leadsByDay,
    topCourses: topCourses.map((c) => ({
      courseId: c.courseId,
      course: c.courseId ? courseMap[c.courseId] : null,
      count: c._count.id,
    })),
    recentLeads,
    recentActivities,
  });
}
