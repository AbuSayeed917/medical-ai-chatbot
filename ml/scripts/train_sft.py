import argparse
import json
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM, AutoTokenizer
)
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer
import torch


def load_jsonl(path):
    def gen():
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                yield json.loads(line)
    return list(gen())


def format_chat(example):
    # concatenate messages into a single prompt-target pair for SFT
    messages = example["messages"]
    text = ""
    for m in messages:
        role = m["role"]
        content = m["content"].strip()
        if role == 'system':
            text += f"<|system|>\n{content}\n"
        elif role == 'user':
            text += f"<|user|>\n{content}\n"
        elif role == 'assistant':
            text += f"<|assistant|>\n{content}\n"
    return {"text": text}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base-model', required=True)
    ap.add_argument('--data', required=True)
    ap.add_argument('--val-data', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--epochs', type=int, default=3)
    ap.add_argument('--lr', type=float, default=1e-4)
    ap.add_argument('--bsz', type=int, default=2)
    ap.add_argument('--grad-accum', type=int, default=8)
    ap.add_argument('--max-len', type=int, default=2048)
    args = ap.parse_args()

    device_map = 'auto'
    torch_dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float16

    tokenizer = AutoTokenizer.from_pretrained(args.base_model, use_fast=True)
    tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        args.base_model,
        load_in_4bit=True,
        torch_dtype=torch_dtype,
        device_map=device_map,
    )

    lora_config = LoraConfig(
        r=16, lora_alpha=32, lora_dropout=0.05,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        bias='none', task_type='CAUSAL_LM'
    )
    model = get_peft_model(model, lora_config)

    train_records = load_jsonl(args.data)
    val_records = load_jsonl(args.val_data)

    train_dataset = [format_chat(x) for x in train_records]
    val_dataset = [format_chat(x) for x in val_records]

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        dataset_text_field='text',
        max_seq_length=args.max_len,
        packing=True,
        args=dict(
            output_dir=args.out,
            num_train_epochs=args.epochs,
            per_device_train_batch_size=args.bsz,
            gradient_accumulation_steps=args.grad_accum,
            learning_rate=args.lr,
            logging_steps=20,
            save_steps=200,
            evaluation_strategy='steps',
            eval_steps=200,
            save_total_limit=2,
            bf16=torch.cuda.is_available(),
        )
    )

    trainer.train()
    trainer.save_model(args.out)
    tokenizer.save_pretrained(args.out)


if __name__ == '__main__':
    main()

