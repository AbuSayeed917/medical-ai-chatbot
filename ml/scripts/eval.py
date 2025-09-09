import argparse
import json
import numpy as np


def load_jsonl(path):
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            yield json.loads(line)


def simple_metrics(samples):
    # Very small proxy metrics: length, presence of disclaimer, and coverage of key terms
    lengths = []
    disclaimers = 0
    for s in samples:
        txt = s.get('generated', '')
        lengths.append(len(txt))
        if 'educational purposes' in txt.lower() or 'not medical advice' in txt.lower():
            disclaimers += 1
    return {
        'avg_length': float(np.mean(lengths)) if lengths else 0.0,
        'disclaimer_rate': disclaimers / max(len(samples), 1)
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True, help='Path to LoRA or merged model (inference to be done externally).')
    ap.add_argument('--data', required=True, help='test.jsonl created by prep script')
    ap.add_argument('--outputs', default='ml/outputs/eval_outputs.jsonl')
    args = ap.parse_args()

    # This script assumes you will generate with your serving stack and write to outputs.
    # For portfolio, we compute proxy metrics on existing outputs.
    samples = list(load_jsonl(args.outputs)) if os.path.exists(args.outputs) else []
    print(json.dumps(simple_metrics(samples), indent=2))


if __name__ == '__main__':
    import os
    main()

