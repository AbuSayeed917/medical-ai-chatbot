const OpenAI = require('openai');
const ChatSession = require('../models/ChatSession');
const { analyzeMedicalQuery, getMedicalContext } = require('./medicalService');

// LOCAL_MODE allows using an OpenAI-compatible local server (e.g., Ollama / llama.cpp server)
const USE_LOCAL = String(process.env.LOCAL_MODE).toLowerCase() === 'true';
const BASE_URL = USE_LOCAL ? (process.env.LOCAL_LLM_BASE_URL || 'http://localhost:11434/v1') : undefined;
const MODEL = USE_LOCAL
  ? (process.env.LOCAL_LLM_MODEL || 'llama3.1:8b')
  : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || (USE_LOCAL ? 'local-llm' : ''),
  baseURL: BASE_URL
});

const SYSTEM_PROMPT = `You are a medical education assistant designed to help medical students learn about basic health issues. 

Key guidelines:
- Provide educational information for learning purposes only
- Always emphasize that this is for educational purposes, not medical diagnosis
- Encourage students to consult qualified healthcare professionals for real medical advice
- Focus on common conditions, symptoms, and basic medical knowledge
- Use clear, educational language appropriate for medical students
- Include relevant medical terminology with explanations
- Suggest related topics for further study

Remember: You are an educational tool, not a replacement for professional medical consultation.`;

async function sendMessage(message, userId, sessionId) {
  try {
    let session = await ChatSession.findOne({ sessionId });
    
    if (!session) {
      session = new ChatSession({
        sessionId,
        userId,
        messages: []
      });
    }

    const medicalAnalysis = await analyzeMedicalQuery(message);
    const medicalContext = await getMedicalContext(medicalAnalysis.category, medicalAnalysis.terms);

    const conversationHistory = session.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    if (medicalContext.length > 0) {
      messages.splice(-1, 0, {
        role: 'system',
        content: `Relevant medical information: ${JSON.stringify(medicalContext)}`
      });
    }

    let assistantResponse;
    try {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7
      });
      assistantResponse = completion.choices?.[0]?.message?.content || '';
    } catch (llmErr) {
      console.error('LLM call failed, falling back to knowledge-only:', llmErr.message);
      // Knowledge-only fallback if LLM is unavailable
      const kbText = (medicalContext || []).map((k, i) => `${i + 1}. ${k.term}: ${k.definition || k.description || ''}`).join('\n');
      assistantResponse = [
        'Educational summary based on local knowledge base (LLM unavailable):',
        kbText || 'No relevant items found in knowledge base.',
        '\nNote: This is for educational purposes only and not medical advice.'
      ].join('\n');
    }

    session.messages.push({
      role: 'user',
      content: message,
      metadata: medicalAnalysis
    });

    session.messages.push({
      role: 'assistant',
      content: assistantResponse,
      metadata: {
        category: medicalAnalysis.category,
        relatedTopics: medicalAnalysis.relatedTopics
      }
    });

    await session.save();

    return {
      response: assistantResponse,
      sessionId,
      metadata: medicalAnalysis,
      suggestions: await getSuggestedQuestions(medicalAnalysis.category)
    };

  } catch (error) {
    console.error('Chat service error:', error);
    throw new Error('Failed to process message');
  }
}

async function getChatHistory(sessionId) {
  try {
    const session = await ChatSession.findOne({ sessionId });
    return session ? session.messages : [];
  } catch (error) {
    throw new Error('Failed to retrieve chat history');
  }
}

async function clearChatHistory(sessionId) {
  try {
    await ChatSession.findOneAndUpdate(
      { sessionId },
      { messages: [] }
    );
  } catch (error) {
    throw new Error('Failed to clear chat history');
  }
}

async function getSuggestedQuestions(category = 'general') {
  const suggestions = {
    general: [
      "What are the vital signs and their normal ranges?",
      "Explain the difference between acute and chronic conditions",
      "What is the basic approach to patient history taking?"
    ],
    symptom: [
      "What causes headaches and when should I be concerned?",
      "How do I differentiate between viral and bacterial infections?",
      "What are the red flags for abdominal pain?"
    ],
    disease: [
      "What are the most common cardiovascular diseases?",
      "Explain diabetes mellitus and its complications",
      "What are the stages of hypertension?"
    ],
    anatomy: [
      "Describe the structure and function of the heart",
      "What are the major organs of the digestive system?",
      "Explain the respiratory system anatomy"
    ]
  };

  return suggestions[category] || suggestions.general;
}

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getSuggestedQuestions
};
