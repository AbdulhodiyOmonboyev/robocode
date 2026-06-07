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

  const stages = await db.stage.findMany({ orderBy: { order: "asc" } });
  const wonStageIds = stages.filter((s) => s.isWon).map((s) => s.id);

  const [
    totalLeads,
    todayLeads,
    enrolledThisMonth,
    todayReminders,
    stageGroups,
    sourceDistribution,
    leadsByDay,
    topCourses,
    recentLeads,
    recentActivities,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    wonStageIds.length
      ? db.lead.count({ where: { stageId: { in: wonStageIds }, createdAt: { gte: monthStart } } })
      : Promise.resolve(0),
    db.reminder.count({
      where: { status: "PENDING", remindAt: { gte: todayStart, lte: todayEnd } },
    }),
    db.lead.groupBy({ by: ["stageId"], _count: { id: true } }),
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
      include: { course: { select: { name: true, color: true } }, stage: { select: { name: true, color: true } }, assignedTo: { select: { fullName: true } } },
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

  // Stage distribution in stage order
  const countByStage = Object.fromEntries(stageGroups.map((g) => [g.stageId ?? "none", g._count.id]));
  const stageDistribution = stages.map((s) => ({
    stageId: s.id,
    name: s.name,
    color: s.color,
    count: countByStage[s.id] ?? 0,
  }));

  const totalConverted = wonStageIds.reduce((sum, id) => sum + (countByStage[id] ?? 0), 0);
  const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : "0";

  return NextResponse.json({
    kpis: {
      totalLeads,
      todayLeads,
      enrolledThisMonth,
      todayReminders,
      conversionRate,
    },
    stageDistribution,
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
