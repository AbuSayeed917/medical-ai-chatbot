const MedicalKnowledge = require('../models/MedicalKnowledge');

// Very lightweight heuristic categorizer for student queries
function analyzeMedicalQuery(text = '') {
  const t = String(text).toLowerCase();
  const symptomKeywords = ['pain', 'fever', 'cough', 'nausea', 'headache', 'fatigue', 'dizzy', 'rash'];
  const diseaseHints = ['diabetes', 'hypertension', 'asthma', 'influenza', 'covid', 'cancer'];
  const anatomyHints = ['heart', 'lung', 'liver', 'kidney', 'brain', 'stomach'];
  let category = 'general';
  if (symptomKeywords.some(k => t.includes(k))) category = 'symptom';
  else if (diseaseHints.some(k => t.includes(k))) category = 'disease';
  else if (anatomyHints.some(k => t.includes(k))) category = 'anatomy';

  // naïve term extraction: split and keep medically-looking tokens
  const terms = Array.from(new Set(
    t.replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
  ));

  const relatedTopics = {
    symptom: ['differential diagnosis', 'red flags', 'history taking'],
    disease: ['pathophysiology', 'risk factors', 'management'],
    anatomy: ['structure', 'function', 'clinical correlations'],
    general: ['vital signs', 'SOAP notes', 'basic pharmacology']
  };

  return {
    category,
    terms,
    relatedTopics: relatedTopics[category]
  };
}

// Retrieve relevant items from the medical knowledge base (MongoDB text index)
async function getMedicalContext(category = 'general', terms = []) {
  const query = terms && terms.length ? terms.join(' ') : '';
  const filter = {};
  if (category && category !== 'general') filter.category = category;
  try {
    const results = await MedicalKnowledge
      .find(query ? { $text: { $search: query }, ...filter } : filter)
      .select({ term: 1, category: 1, definition: 1, description: 1, sources: 1, score: { $meta: 'textScore' } })
      .sort(query ? { score: { $meta: 'textScore' } } : { lastUpdated: -1 })
      .limit(5)
      .lean();
    return results.map(r => ({
      term: r.term,
      category: r.category,
      definition: r.definition,
      description: r.description,
      sources: r.sources || []
    }));
  } catch (err) {
    console.error('getMedicalContext error:', err.message);
    return [];
  }
}

// API helpers used by routes
async function getSymptomInfo(symptom) {
  const items = await MedicalKnowledge.find({ term: new RegExp(`^${symptom}$`, 'i'), category: 'symptom' }).lean();
  if (items.length) return items[0];
  const ctx = await getMedicalContext('symptom', [symptom]);
  return ctx[0] || { term: symptom, category: 'symptom', definition: 'No data available yet.' };
}

async function getDiseaseInfo(disease) {
  const items = await MedicalKnowledge.find({ term: new RegExp(`^${disease}$`, 'i'), category: 'disease' }).lean();
  if (items.length) return items[0];
  const ctx = await getMedicalContext('disease', [disease]);
  return ctx[0] || { term: disease, category: 'disease', definition: 'No data available yet.' };
}

async function getMedicationInfo(medication) {
  const items = await MedicalKnowledge.find({ term: new RegExp(`^${medication}$`, 'i'), category: 'medication' }).lean();
  if (items.length) return items[0];
  const ctx = await getMedicalContext('medication', [medication]);
  return ctx[0] || { term: medication, category: 'medication', definition: 'No data available yet.' };
}

async function getAnatomyInfo(organ) {
  const items = await MedicalKnowledge.find({ term: new RegExp(`^${organ}$`, 'i'), category: 'anatomy' }).lean();
  if (items.length) return items[0];
  const ctx = await getMedicalContext('anatomy', [organ]);
  return ctx[0] || { term: organ, category: 'anatomy', definition: 'No data available yet.' };
}

async function searchMedicalTerms(query, category) {
  const filter = {};
  if (category) filter.category = category;
  const results = await MedicalKnowledge
    .find(query ? { $text: { $search: query }, ...filter } : filter)
    .select({ term: 1, category: 1, definition: 1, score: { $meta: 'textScore' } })
    .sort(query ? { score: { $meta: 'textScore' } } : { lastUpdated: -1 })
    .limit(20)
    .lean();
  return results;
}

async function getQuizQuestions(category = 'general', difficulty = 'medium', count = 5) {
  // Simple synthetic quiz generator using stored terms
  const pool = await MedicalKnowledge.find(category && category !== 'general' ? { category } : {}).limit(200).lean();
  const items = pool.length ? pool : [
    { term: 'Hypertension', category: 'disease', definition: 'Elevated blood pressure' },
    { term: 'Tachycardia', category: 'symptom', definition: 'Fast heart rate' },
    { term: 'Ibuprofen', category: 'medication', definition: 'NSAID pain reliever' }
  ];
  const questions = [];
  for (let i = 0; i < Math.min(count, items.length); i++) {
    const it = items[i % items.length];
    const stem = `What best describes ${it.term}?`;
    const correct = it.definition || 'Definition not available';
    const distractors = ['A surgical procedure', 'A laboratory test', 'An imaging modality'];
    questions.push({
      stem,
      options: shuffle([correct, ...distractors]).slice(0, 4),
      answer: correct,
      metadata: { category: it.category, difficulty }
    });
  }
  return questions;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  analyzeMedicalQuery,
  getMedicalContext,
  getSymptomInfo,
  getDiseaseInfo,
  getMedicationInfo,
  getAnatomyInfo,
  searchMedicalTerms,
  getQuizQuestions
};

