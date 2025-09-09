/*
  Import RxTerms CSV (NIH/NLM) into MedicalKnowledge as medications.
  - Download RxTerms (CSV) from: https://mor.nlm.nih.gov/RxNav/downloads.html
  - Typical file: rxterms_YYYYMMDD.csv (or TXT). Ensure it's CSV.
  - Usage: node backend/scripts/importRxTerms.js --file /path/to/rxterms.csv
*/
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/database');
const MedicalKnowledge = require('../models/MedicalKnowledge');

async function importCsv(filePath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const records = [];
    stream
      .pipe(parse.parse({ columns: true, relax_quotes: true, skip_empty_lines: true }))
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

function pickTerm(row) {
  // Common RxTerms columns: FULL_NAME, GENERIC_NAME, BRAND_NAME, RXCUI
  return row.FULL_NAME || row.GENERIC_NAME || row.BRAND_NAME || row.RXCUI;
}

async function main() {
  await connectDB();
  const args = process.argv.slice(2);
  const idx = args.findIndex(a => a === '--file');
  if (idx === -1) {
    console.error('Provide --file /path/to/rxterms.csv');
    process.exit(1);
  }
  const csvPath = path.resolve(process.cwd(), args[idx + 1]);
  const rows = await importCsv(csvPath);

  let upserted = 0;
  for (const r of rows) {
    const term = pickTerm(r);
    if (!term) continue;
    const synonyms = [];
    if (r.GENERIC_NAME && r.GENERIC_NAME !== term) synonyms.push(r.GENERIC_NAME);
    if (r.BRAND_NAME && r.BRAND_NAME !== term) synonyms.push(r.BRAND_NAME);
    const doc = {
      term,
      category: 'medication',
      definition: r.DISPLAY_NAME || r.FULL_NAME || `Medication: ${term}`,
      description: r.STRENGTH ? `Strength: ${r.STRENGTH}` : undefined,
      synonyms: Array.from(new Set(synonyms)),
      sources: [{ name: 'RxTerms (NLM)', url: 'https://mor.nlm.nih.gov/RxNav/', reliability: 'high' }]
    };
    await MedicalKnowledge.findOneAndUpdate(
      { term },
      { $set: doc, $setOnInsert: { lastUpdated: new Date(), isVerified: false } },
      { upsert: true }
    );
    upserted += 1;
  }
  console.log(`RxTerms import complete. Upserted ${upserted} records.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

