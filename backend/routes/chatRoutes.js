const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getChatHistory, 
  clearChatHistory,
  getSuggestedQuestions 
} = require('../services/chatService');

router.post('/message', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;
    const response = await sendMessage(message, userId, sessionId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await getChatHistory(sessionId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await clearChatHistory(sessionId);
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { category } = req.query;
    const suggestions = await getSuggestedQuestions(category);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;