Medical Education LLM — RAG + QLoRA

Overview
- Goal: Train a small instruction model (3–8B) for educational medical Q&A using QLoRA and ground it with RAG from the app’s MongoDB knowledge base.
- Outputs: LoRA adapters, merged model for inference (optional), and a tiny evaluation suite.

Hardware Targets
- CPU-only or low-VRAM: Start with 3–4B (Phi-3 Mini, Qwen2.5-3B, Llama 3.2 3B). For 16–32GB RAM, try 7–8B.

Environment
- Python 3.10+
- Recommended: conda or venv

Install (CUDA optional)
pip install -U transformers trl peft bitsandbytes datasets accelerate evaluate sentencepiece

Data Pipeline
- Place raw sources in ml/data/raw/ (jsonl/csv/tsv supported by prep script).
- Run prep to create chat-style SFT datasets in ml/data/processed/.

Prep
python ml/scripts/prep_data.py \
  --input ml/data/raw/ \
  --output ml/data/processed/ \
  --min-turns 1 --max-length 2048

Train (QLoRA SFT)
python ml/scripts/train_sft.py \
  --base-model meta-llama/Llama-3.2-3B-Instruct \
  --data ml/data/processed/train.jsonl \
  --val-data ml/data/processed/val.jsonl \
  --out ml/outputs/llama3.2-3b-edu-lora

Eval (quick suite)
python ml/scripts/eval.py \
  --model ml/outputs/llama3.2-3b-edu-lora \
  --data ml/data/processed/test.jsonl

Merge LoRA (optional, for export)
python ml/scripts/merge_and_export.py \
  --base meta-llama/Llama-3.2-3B-Instruct \
  --lora ml/outputs/llama3.2-3b-edu-lora \
  --out ml/exports/llama3.2-3b-edu-merged

Notes
- Licensing: Ensure each dataset’s license allows fine-tuning and redistribution.
- Safety: This is for education; never deploy as medical advice.

