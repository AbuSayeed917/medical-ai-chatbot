import argparse
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import os


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True)
    ap.add_argument('--lora', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)

    base = AutoModelForCausalLM.from_pretrained(args.base, device_map='cpu')
    tok = AutoTokenizer.from_pretrained(args.base)
    merged = PeftModel.from_pretrained(base, args.lora)
    merged = merged.merge_and_unload()

    merged.save_pretrained(args.out)
    tok.save_pretrained(args.out)
    print(f'Merged model saved to {args.out}')


if __name__ == '__main__':
    main()

