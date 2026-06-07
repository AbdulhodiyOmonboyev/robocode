const path = require("path");
require(path.join(__dirname, "node_modules", "dotenv")).config();
const { Client } = require(path.join(__dirname, "node_modules", "pg"));
const fs = require("fs");

const ddl = [
  `CREATE TABLE IF NOT EXISTS "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT,
    "teacherId" TEXT,
    "days" TEXT,
    "timeFrom" TEXT,
    "timeTo" TEXT,
    "startDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
  );`,
  `DO $$ BEGIN ALTER TABLE "Group" ADD CONSTRAINT "Group_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `DO $$ BEGIN ALTER TABLE "Group" ADD CONSTRAINT "Group_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "groupId" TEXT;`,
  `DO $$ BEGIN ALTER TABLE "Lead" ADD CONSTRAINT "Lead_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
];

(async () => {
  const c = new Client({ connectionString: process.env.DIRECT_URL, ssl: { rejectUnauthorized: false } });
  const out = [];
  try {
    await c.connect();
    for (const s of ddl) { await c.query(s); }
    out.push("OK: Group table + Lead.groupId yaratildi");
  } catch (e) {
    out.push("ERROR: " + (e && e.message ? e.message : String(e)));
  } finally {
    try { await c.end(); } catch (_) {}
  }
  fs.writeFileSync(path.join(__dirname, "migrate3-result.txt"), out.join("\n") + "\n");
  console.log(out.join("\n"));
})();
