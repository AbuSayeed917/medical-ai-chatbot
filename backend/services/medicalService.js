const MedicalKnowledge = require('../models/MedicalKnowledge');

async function analyzeMedicalQuery(query) {
  const medicalKeywords = {
    symptoms: ['pain', 'fever', 'headache', 'nausea', 'fatigue', 'cough', 'shortness', 'dizzy'],
    diseases: ['diabetes', 'hypertension', 'asthma', 'pneumonia', 'covid', 'flu', 'cancer'],
    anatomy: ['heart', 'lung', 'brain', 'kidney', 'liver', 'stomach', 'blood'],
    medications: ['aspirin', 'ibuprofen', 'antibiotic', 'insulin', 'medication', 'drug', 'treatment']
  };

  const queryLower = query.toLowerCase();
  let category = 'general';
  const foundTerms = [];
  
  for (const [cat, keywords] of Object.entries(medicalKeywords)) {
    for (const keyword of keywords) {
      if (queryLower.includes(keyword)) {
        category = cat.slice(0, -1);
        foundTerms.push(keyword);
      }
    }
  }

  return {
    category,
    terms: foundTerms,
    confidence: foundTerms.length > 0 ? 0.8 : 0.3,
    relatedTopics: await getRelatedTopics(category, foundTerms)
  };
}

async function getMedicalContext(category, terms) {
  try {
    if (terms.length === 0) return [];
    
    const knowledge = await MedicalKnowledge.find({
      $or: [
        { term: { $in: terms } },
        { synonyms: { $in: terms } },
        { category: category }
      ]
    }).limit(3);

    return knowledge;
  } catch (error) {
    console.error('Error fetching medical context:', error);
    return [];
  }
}

async function getSymptomInfo(symptom) {
  try {
    const info = await MedicalKnowledge.findOne({ 
      term: symptom.toLowerCase(),
      category: 'symptom'
    });
    
    if (!info) {
      return {
        message: 'Information not found in database',
        suggestion: 'Try searching for related terms or consult medical literature'
      };
    }
    
    return info;
  } catch (error) {
    throw new Error('Failed to retrieve symptom information');
  }
}

async function getDiseaseInfo(disease) {
  try {
    const info = await MedicalKnowledge.findOne({ 
      term: disease.toLowerCase(),
      category: 'disease'
    });
    
    return info || { message: 'Disease information not found' };
  } catch (error) {
    throw new Error('Failed to retrieve disease information');
  }
}

async function getMedicationInfo(medication) {
  try {
    const info = await MedicalKnowledge.findOne({ 
      term: medication.toLowerCase(),
      category: 'medication'
    });
    
    return info || { message: 'Medication information not found' };
  } catch (error) {
    throw new Error('Failed to retrieve medication information');
  }
}

async function getAnatomyInfo(organ) {
  try {
    const info = await MedicalKnowledge.findOne({ 
      term: organ.toLowerCase(),
      category: 'anatomy'
    });
    
    return info || { message: 'Anatomy information not found' };
  } catch (error) {
    throw new Error('Failed to retrieve anatomy information');
  }
}

async function searchMedicalTerms(query, category = null) {
  try {
    const searchQuery = category 
      ? { $text: { $search: query }, category }
      : { $text: { $search: query } };
      
    const results = await MedicalKnowledge.find(searchQuery)
      .select('term category definition')
      .limit(10);
      
    return results;
  } catch (error) {
    throw new Error('Failed to search medical terms');
  }
}

async function getQuizQuestions(category, difficulty = 'medium', count = 5) {
  const questions = {
    cardiology: [
      {
        question: "What is the normal resting heart rate range for adults?",
        options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"],
        correct: 1,
        explanation: "Normal resting heart rate for adults is 60-100 beats per minute"
      }
    ],
    respiratory: [
      {
        question: "What is the primary muscle of respiration?",
        options: ["Intercostal muscles", "Diaphragm", "Scalene muscles", "Pectoralis major"],
        correct: 1,
        explanation: "The diaphragm is the primary muscle responsible for breathing"
      }
    ],
    general: [
      {
        question: "What are the four vital signs?",
        options: [
          "Heart rate, blood pressure, temperature, respiratory rate",
          "Heart rate, blood pressure, oxygen saturation, pain level",
          "Temperature, pulse, respiration, blood glucose",
          "Blood pressure, heart rate, weight, height"
        ],
        correct: 0,
        explanation: "The four traditional vital signs are heart rate, blood pressure, body temperature, and respiratory rate"
      }
    ]
  };

  const categoryQuestions = questions[category] || questions.general;
  return categoryQuestions.slice(0, count);
}

async function getRelatedTopics(category, terms) {
  const relatedTopics = {
    symptom: ['differential diagnosis', 'physical examination', 'patient assessment'],
    disease: ['pathophysiology', 'epidemiology', 'treatment protocols'],
    anatomy: ['physiology', 'medical imaging', 'clinical correlations'],
    medication: ['pharmacology', 'drug interactions', 'dosing guidelines']
  };

  return relatedTopics[category] || ['medical terminology', 'clinical practice'];
}

module.exports = {
  analyzeMedicalQuery,
  getMedicalContext,
  getSymptomInfo,
  getDiseaseInfo,
  getMedicationInfo,
  getAnatomyInfo,
  searchMedicalTerms,
  getQuizQuestions,
  getRelatedTopics
};