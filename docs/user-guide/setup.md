Backend Setup
- Copy backend/.env.example to backend/.env and adjust values.
- Ensure MongoDB is running locally (default URI in .env.example).
- Local LLM (recommended for offline dev):
  - Install Ollama, then: `ollama pull llama3.1:8b` and run `ollama serve`.
  - Keep `LOCAL_MODE=true`, `LOCAL_LLM_BASE_URL=http://localhost:11434/v1`, `LOCAL_LLM_MODEL=llama3.1:8b`.
- Start API: from backend, run `npm install` then `npm run dev`.

RAG + Knowledge Base
- Insert medical terms into MongoDB collection `medicalknowledges` (see backend/models/MedicalKnowledge.js). The text index enables search without external embeddings.
- Use `/api/medical/search?query=...&category=...` to verify retrieval.

ML (QLoRA)
- See ml/README.md. Pipeline: prep data → train LoRA → (optional) merge → serve via Ollama or llama.cpp server with OpenAI-compatible API.
- For portfolio: include metrics from ml/scripts/eval.py and a short model card in your README.

Notes
- This project is for educational purposes only. It must not be used for diagnosis or treatment.

