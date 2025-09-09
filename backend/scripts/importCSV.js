/*
  Generic CSV importer for MedicalKnowledge.
  - Expected columns: term,category,definition,description,synonyms,relatedTerms,source_name,source_url
  - synonyms/relatedTerms can be semicolon-separated.
  - Usage: node backend/scripts/importCSV.js --file /path/to/custom_terms.csv
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

function splitList(s) {
  if (!s) return [];
  return String(s)
    .split(/;|\|/)
    .map(x => x.trim())
    .filter(Boolean);
}

async function main() {
  await connectDB();
  const args = process.argv.slice(2);
  const idx = args.findIndex(a => a === '--file');
  if (idx === -1) {
    console.error('Provide --file /path/to/custom_terms.csv');
    process.exit(1);
  }
  const csvPath = path.resolve(process.cwd(), args[idx + 1]);
  const rows = await importCsv(csvPath);

  let upserted = 0;
  for (const r of rows) {
    const term = (r.term || '').trim();
    if (!term) continue;
    const category = (r.category || 'general').trim();
    const doc = {
      term,
      category,
      definition: r.definition || '',
      description: r.description || undefined,
      synonyms: splitList(r.synonyms),
      relatedTerms: splitList(r.relatedTerms),
      sources: (r.source_name || r.source_url)
        ? [{ name: r.source_name || 'source', url: r.source_url || '', reliability: 'high' }]
        : []
    };
    await MedicalKnowledge.findOneAndUpdate(
      { term },
      { $set: doc, $setOnInsert: { lastUpdated: new Date(), isVerified: false } },
      { upsert: true }
    );
    upserted += 1;
  }
  console.log(`CSV import complete. Upserted ${upserted} records.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

