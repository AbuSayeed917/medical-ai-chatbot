import argparse
import json
import os
from pathlib import Path
from glob import glob


def load_items(path):
    items = []
    for fp in glob(os.path.join(path, '**', '*'), recursive=True):
        if not os.path.isfile(fp):
            continue
        if fp.endswith('.jsonl'):
            with open(fp, 'r', encoding='utf-8') as f:
                items.extend(json.loads(line) for line in f)
        elif fp.endswith('.json'):
            with open(fp, 'r', encoding='utf-8') as f:
                obj = json.load(f)
                if isinstance(obj, list):
                    items.extend(obj)
                else:
                    items.append(obj)
        # Extend here if you add CSV/TSV
    return items


def as_chat(sample):
    # Expect fields: question / context / answer
    sys_prompt = (
        "You are a medical education assistant. Provide educational information only, "
        "use clear language for medical students, and include brief definitions of key terms. "
        "Always include a disclaimer that this is not medical advice."
    )
    messages = [
        {"role": "system", "content": sys_prompt},
    ]
    user = sample.get('question') or sample.get('input') or sample.get('prompt')
    ctx = sample.get('context')
    if ctx:
        messages.append({"role": "system", "content": f"Relevant context: {ctx}"})
    if user:
        messages.append({"role": "user", "content": user})
    ans = sample.get('answer') or sample.get('output') or sample.get('response')
    if ans:
        messages.append({"role": "assistant", "content": ans})
    return {"messages": messages}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    ap.add_argument('--output', required=True)
    ap.add_argument('--train-ratio', type=float, default=0.9)
    ap.add_argument('--min-turns', type=int, default=1)
    ap.add_argument('--max-length', type=int, default=2048)
    args = ap.parse_args()

    os.makedirs(args.output, exist_ok=True)
    raw = load_items(args.input)
    chats = []
    for r in raw:
        chat = as_chat(r)
        if len(chat['messages']) >= args.min_turns:
            # crude length filter
            total_len = sum(len(m['content']) for m in chat['messages'])
            if total_len <= args.max_length:
                chats.append(chat)

    n = len(chats)
    n_train = int(n * args.train_ratio)
    train = chats[:n_train]
    val = chats[n_train:]

    with open(Path(args.output) / 'train.jsonl', 'w', encoding='utf-8') as f:
        for ex in train:
            f.write(json.dumps(ex) + '\n')
    with open(Path(args.output) / 'val.jsonl', 'w', encoding='utf-8') as f:
        for ex in val:
            f.write(json.dumps(ex) + '\n')
    # small test equals val by default
    with open(Path(args.output) / 'test.jsonl', 'w', encoding='utf-8') as f:
        for ex in val[:200]:
            f.write(json.dumps(ex) + '\n')

    print(f'Prepared {n} chats. Train={len(train)} Val={len(val)}')


if __name__ == '__main__':
    main()

