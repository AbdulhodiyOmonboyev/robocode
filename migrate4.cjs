const path = require("path");
require(path.join(__dirname, "node_modules", "dotenv")).config();
const { Client } = require(path.join(__dirname, "node_modules", "pg"));
const fs = require("fs");

const ddl = [
  `CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "groupId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "method" TEXT NOT NULL DEFAULT 'cash',
    "type" TEXT NOT NULL DEFAULT 'tuition',
    "forMonth" TEXT,
    "note" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
  );`,
  `DO $$ BEGIN ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `DO $$ BEGIN ALTER TABLE "Payment" ADD CONSTRAINT "Payment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `DO $$ BEGIN ALTER TABLE "Payment" ADD CONSTRAINT "Payment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `CREATE INDEX IF NOT EXISTS "Payment_leadId_idx" ON "Payment"("leadId");`,
  `CREATE INDEX IF NOT EXISTS "Payment_paidAt_idx" ON "Payment"("paidAt");`,
  `CREATE INDEX IF NOT EXISTS "Payment_forMonth_idx" ON "Payment"("forMonth");`,
];

(async () => {
  const c = new Client({ connectionString: process.env.DIRECT_URL, ssl: { rejectUnauthorized: false } });
  const out = [];
  try {
    await c.connect();
    for (const s of ddl) { await c.query(s); }
    out.push("OK: Payment jadvali yaratildi");
  } catch (e) {
    out.push("ERROR: " + (e && e.message ? e.message : String(e)));
  } finally {
    try { await c.end(); } catch (_) {}
  }
  fs.writeFileSync(path.join(__dirname, "migrate4-result.txt"), out.join("\n") + "\n");
  console.log(out.join("\n"));
})();
