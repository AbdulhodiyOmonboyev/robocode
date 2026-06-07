const path = require("path");
require(path.join(__dirname, "node_modules", "dotenv")).config();
const { Client } = require(path.join(__dirname, "node_modules", "pg"));
const fs = require("fs");

const statements = [
  'ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "lessonTime" TEXT;',
];

(async () => {
  const c = new Client({ connectionString: process.env.DIRECT_URL, ssl: { rejectUnauthorized: false } });
  const out = [];
  try {
    await c.connect();
    for (const s of statements) {
      await c.query(s);
      out.push("OK: " + s);
    }
  } catch (e) {
    out.push("ERROR: " + (e && e.message ? e.message : String(e)));
  } finally {
    try { await c.end(); } catch (_) {}
  }
  fs.writeFileSync(path.join(__dirname, "migrate-result.txt"), out.join("\n") + "\n");
  console.log(out.join("\n"));
})();
