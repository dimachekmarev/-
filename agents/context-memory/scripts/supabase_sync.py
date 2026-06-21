#!/usr/bin/env python3
import argparse
import json
import os
import sqlite3
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(os.environ.get('CONTEXT_MEMORY_ROOT', '/root/obsidian-vault/agents/context-memory'))
DB = ROOT / 'agent_memory.db'
BATCH = 100

TABLES = {
    'memory_items': 'agent_memory_items',
    'entities': 'agent_memory_entities',
    'relations': 'agent_memory_relations',
}

COLUMNS = {
    'memory_items': ['id','kind','title','body','source_path','source_hash','importance','confidence','valid_from','valid_to','tags','updated_at'],
    'entities': ['id','name','entity_type','aliases','source_path','updated_at'],
    'relations': ['id','src','dst','relation','evidence','source_path','valid_from','valid_to','updated_at'],
}

def env():
    url = os.getenv('SUPABASE_URL', '').rstrip('/')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_SECRET_KEY') or os.getenv('SUPABASE_PUBLISHABLE_KEY')
    if not url or not key:
        raise SystemExit('missing SUPABASE_URL or SUPABASE key')
    return url, key

def parse_json_fields(row):
    for key in ('tags', 'aliases'):
        if key in row and isinstance(row[key], str):
            try:
                row[key] = json.loads(row[key])
            except Exception:
                row[key] = []
    return row

def rows_for(conn, table):
    cols = COLUMNS[table]
    sql = 'select ' + ','.join(cols) + ' from ' + table
    for values in conn.execute(sql):
        yield parse_json_fields(dict(zip(cols, values)))

def post_batch(url, key, table, rows):
    if not rows:
        return 0
    endpoint = f'{url}/rest/v1/{table}?on_conflict=id'
    data = json.dumps(rows, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(
        endpoint,
        data=data,
        method='POST',
        headers={
            'apikey': key,
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal',
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        if resp.status not in (200, 201, 204):
            raise RuntimeError(f'bad status {resp.status}')
    return len(rows)

def sync(args):
    url, key = env()
    if not DB.exists():
        raise SystemExit(f'missing db: {DB}')
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    totals = {}
    for local, remote in TABLES.items():
        batch = []
        total = 0
        for row in rows_for(conn, local):
            batch.append(row)
            if len(batch) >= BATCH:
                if not args.dry_run:
                    post_batch(url, key, remote, batch)
                total += len(batch)
                batch = []
        if batch:
            if not args.dry_run:
                post_batch(url, key, remote, batch)
            total += len(batch)
        totals[remote] = total
    print(json.dumps({'ok': True, 'dry_run': args.dry_run, 'totals': totals}, ensure_ascii=False))

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    try:
        sync(args)
    except urllib.error.HTTPError as e:
        print(json.dumps({'ok': False, 'error': 'http', 'status': e.code, 'reason': str(e.reason)}, ensure_ascii=False))
        sys.exit(2)
    except Exception as e:
        print(json.dumps({'ok': False, 'error': type(e).__name__, 'message': str(e)[:200]}, ensure_ascii=False))
        sys.exit(1)

if __name__ == '__main__':
    main()
