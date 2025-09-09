/*
  Seed MedicalKnowledge collection with curated demo data
  Usage:
    NODE_ENV=development node backend/scripts/seedMedicalKnowledge.js --file database/seeds/demo_medical_knowledge.json
*/
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/database');
const MedicalKnowledge = require('../models/MedicalKnowledge');

async function main() {
  await connectDB();

  const args = process.argv.slice(2);
  const fileIdx = args.findIndex(a => a === '--file');
  const filePath = fileIdx !== -1 ? args[fileIdx + 1] : 'database/seeds/demo_medical_knowledge.json';
  const abs = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(abs)) {
    console.error('Seed file not found:', abs);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(abs, 'utf8'));
  let inserted = 0, updated = 0;
  for (const doc of data) {
    // Upsert on term
    const res = await MedicalKnowledge.findOneAndUpdate(
      { term: doc.term },
      { $set: doc, $setOnInsert: { isVerified: false, lastUpdated: new Date() } },
      { upsert: true, new: true }
    );
    if (res) {
      // crude way to count new vs existing: check _v? we can't easily; run a find first
      // For simplicity, assume upsert means inserted or updated indistinguishably
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  console.log(`Seed complete. Upserted ${inserted} records.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

