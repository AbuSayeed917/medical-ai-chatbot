const mongoose = require('mongoose');

const medicalKnowledgeSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['symptom', 'disease', 'medication', 'anatomy', 'procedure', 'general'],
    required: true
  },
  definition: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  synonyms: [String],
  relatedTerms: [String],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency']
  },
  commonCauses: [String],
  symptoms: [String],
  treatments: [String],
  prevention: [String],
  whenToSeeDoctor: {
    type: String
  },
  medicalSpecialty: [String],
  ageGroup: [String],
  sources: [{
    name: String,
    url: String,
    reliability: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

medicalKnowledgeSchema.index({ term: 'text', description: 'text' });

module.exports = mongoose.model('MedicalKnowledge', medicalKnowledgeSchema);