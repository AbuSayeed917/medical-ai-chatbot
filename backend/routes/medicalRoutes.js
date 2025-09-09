const express = require('express');
const router = express.Router();
const { 
  getSymptomInfo,
  getDiseaseInfo,
  getMedicationInfo,
  getAnatomyInfo,
  searchMedicalTerms,
  getQuizQuestions
} = require('../services/medicalService');

router.get('/symptoms/:symptom', async (req, res) => {
  try {
    const { symptom } = req.params;
    const info = await getSymptomInfo(symptom);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/diseases/:disease', async (req, res) => {
  try {
    const { disease } = req.params;
    const info = await getDiseaseInfo(disease);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/medications/:medication', async (req, res) => {
  try {
    const { medication } = req.params;
    const info = await getMedicationInfo(medication);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/anatomy/:organ', async (req, res) => {
  try {
    const { organ } = req.params;
    const info = await getAnatomyInfo(organ);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query, category } = req.query;
    const results = await searchMedicalTerms(query, category);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/quiz/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { difficulty = 'medium', count = 5 } = req.query;
    const questions = await getQuizQuestions(category, difficulty, parseInt(count));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;