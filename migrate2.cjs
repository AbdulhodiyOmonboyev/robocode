const path = require("path");
require(path.join(__dirname, "node_modules", "dotenv")).config();
const { Client } = require(path.join(__dirname, "node_modules", "pg"));
const crypto = require("crypto");
const fs = require("fs");

const cuid = () => "c" + crypto.randomBytes(12).toString("hex");

const ddl = [
  `CREATE TABLE IF NOT EXISTS "Stage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isWon" BOOLEAN NOT NULL DEFAULT false,
    "isLost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
  );`,
  `CREATE INDEX IF NOT EXISTS "Stage_order_idx" ON "Stage"("order");`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "stageId" TEXT;`,
  `DO $$ BEGIN
     ALTER TABLE "Lead" ADD CONSTRAINT "Lead_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
];

// status -> {name, color, order, isWon, isLost}
const defaults = [
  ["NEW",             "Yangi",                 "#3b82f6", 1, false, false],
  ["CONTACTED",       "Bog'lanildi",           "#eab308", 2, false, false],
  ["INTERESTED",      "Qiziqyapti",            "#f97316", 3, false, false],
  ["TRIAL_BOOKED",    "Sinov darsiga yozildi", "#a855f7", 4, false, false],
  ["TRIAL_COMPLETED", "Sinov darsi o'tdi",     "#06b6d4", 5, false, false],
  ["ENROLLED",        "Yozildi",               "#10b981", 6, true,  false],
  ["POSTPONED",       "Keyinroqqa",            "#6b7280", 7, false, false],
  ["LOST",            "Yo'qotildi",            "#ef4444", 8, false, true ],
];

(async () => {
  const c = new Client({ connectionString: process.env.DIRECT_URL, ssl: { rejectUnauthorized: false } });
  const out = [];
  try {
    await c.connect();
    for (const s of ddl) { await c.query(s); }
    out.push("OK: schema (Stage table + Lead.stageId)");

    const { rows } = await c.query('SELECT COUNT(*)::int AS n FROM "Stage"');
    if (rows[0].n === 0) {
      for (const [status, name, color, order, isWon, isLost] of defaults) {
        const id = cuid();
        await c.query(
          'INSERT INTO "Stage" ("id","name","color","order","isWon","isLost","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,now())',
          [id, name, color, order, isWon, isLost]
        );
        const upd = await c.query('UPDATE "Lead" SET "stageId"=$1 WHERE "status"=$2 AND "stageId" IS NULL', [id, status]);
        out.push(`Stage "${name}" yaratildi, ${upd.rowCount} lid bog'landi`);
      }
    } else {
      out.push("Stage jadvalida ma'lumot bor — seed o'tkazib yuborildi");
    }
  } catch (e) {
    out.push("ERROR: " + (e && e.message ? e.message : String(e)));
  } finally {
    try { await c.end(); } catch (_) {}
  }
  fs.writeFileSync(path.join(__dirname, "migrate2-result.txt"), out.join("\n") + "\n");
  console.log(out.join("\n"));
})();
