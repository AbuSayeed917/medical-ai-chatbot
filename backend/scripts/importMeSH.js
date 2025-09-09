/*
  Import MeSH Descriptors XML into MedicalKnowledge
  - Download MeSH descriptor data (e.g., desc2024.xml) from NLM:
    https://nlmpubs.nlm.nih.gov/mesh/MESH_FILES/xmlmesh/desc2024.xml
  - Usage: node backend/scripts/importMeSH.js --file /path/to/desc2024.xml
*/
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const xml2js = require('xml2js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/database');
const MedicalKnowledge = require('../models/MedicalKnowledge');

const readFile = promisify(fs.readFile);

function mapCategoryFromTree(treeNums = []) {
  // Heuristic mapping by MeSH tree numbers
  // A = Anatomy, C = Diseases, D = Chemicals and Drugs, E = Analytical/Diagnostic/Therapeutic Techniques
  const prefixes = treeNums.map(t => String(t).trim()[0]).filter(Boolean);
  if (prefixes.includes('A')) return 'anatomy';
  if (prefixes.includes('C')) return 'disease';
  if (prefixes.includes('D')) return 'medication';
  if (prefixes.includes('E')) return 'procedure';
  return 'general';
}

function extractText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return extractText(node[0]);
  if (typeof node === 'object') {
    // pick first string value found
    for (const k of Object.keys(node)) {
      const v = node[k];
      const t = extractText(v);
      if (t) return t;
    }
  }
  return '';
}

async function main() {
  await connectDB();
  const args = process.argv.slice(2);
  const fileIdx = args.findIndex(a => a === '--file');
  if (fileIdx === -1) {
    console.error('Provide --file /path/to/descXXXX.xml');
    process.exit(1);
  }
  const xmlPath = path.resolve(process.cwd(), args[fileIdx + 1]);
  const xml = await readFile(xmlPath, 'utf8');
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: true, mergeAttrs: true });
  const records = parsed?.DescriptorRecordSet?.DescriptorRecord || [];

  let upserted = 0;
  for (const rec of records) {
    const name = extractText(rec.DescriptorName?.[0]?.String);
    if (!name) continue;
    const scope = extractText(rec.ScopeNote);
    const tree = (rec.TreeNumberList?.[0]?.TreeNumber || []).map(extractText);
    const synonyms = (rec.ConceptList?.[0]?.Concept || [])
      .flatMap(c => (c.TermList?.[0]?.Term || []).map(t => extractText(t.String)))
      .filter(s => s && s !== name);
    const category = mapCategoryFromTree(tree);

    const doc = {
      term: name,
      category,
      definition: scope || `MeSH descriptor for ${name}.`,
      description: scope || undefined,
      synonyms: Array.from(new Set(synonyms)).slice(0, 10),
      sources: [{ name: 'MeSH (NLM)', url: 'https://www.nlm.nih.gov/mesh/meshhome.html', reliability: 'high' }]
    };

    await MedicalKnowledge.findOneAndUpdate(
      { term: name },
      { $set: doc, $setOnInsert: { lastUpdated: new Date(), isVerified: false } },
      { upsert: true }
    );
    upserted += 1;
  }

  console.log(`MeSH import complete. Upserted ${upserted} records.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

