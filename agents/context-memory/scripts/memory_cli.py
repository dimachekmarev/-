#!/usr/bin/env python3
import argparse, hashlib, json, os, re, sqlite3, sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(os.environ.get('CONTEXT_MEMORY_ROOT', '/root/obsidian-vault/agents/context-memory'))
VAULT = Path(os.environ.get('OBSIDIAN_VAULT_PATH', '/root/obsidian-vault'))
DB = ROOT / 'agent_memory.db'
EXCLUDE_PARTS = {'.git', '.trash', 'hermes-memory-backup', '__pycache__'}
SECRET_NAME_RE = re.compile(r'(credential|credentials|secret|secrets|token|tokens|password|passwd|api[-_ ]?key|ключ|парол|доступ)', re.I)
MAX_DOC_CHARS = 18000
WIKILINK_RE = re.compile(r'\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]')
HEADING_RE = re.compile(r'^(#{1,6})\s+(.+?)\s*$', re.M)

SCHEMA = """
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS memory_items (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  source_path TEXT,
  source_hash TEXT,
  importance INTEGER DEFAULT 3,
  confidence REAL DEFAULT 0.8,
  valid_from TEXT,
  valid_to TEXT,
  tags TEXT DEFAULT '[]',
  updated_at TEXT NOT NULL
);
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(title, body, tags, content='memory_items', content_rowid='rowid', tokenize='unicode61');
CREATE TRIGGER IF NOT EXISTS memory_items_ai AFTER INSERT ON memory_items BEGIN
  INSERT INTO memory_fts(rowid, title, body, tags) VALUES (new.rowid, new.title, new.body, new.tags);
END;
CREATE TRIGGER IF NOT EXISTS memory_items_ad AFTER DELETE ON memory_items BEGIN
  INSERT INTO memory_fts(memory_fts, rowid, title, body, tags) VALUES('delete', old.rowid, old.title, old.body, old.tags);
END;
CREATE TRIGGER IF NOT EXISTS memory_items_au AFTER UPDATE ON memory_items BEGIN
  INSERT INTO memory_fts(memory_fts, rowid, title, body, tags) VALUES('delete', old.rowid, old.title, old.body, old.tags);
  INSERT INTO memory_fts(rowid, title, body, tags) VALUES (new.rowid, new.title, new.body, new.tags);
END;
CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  entity_type TEXT DEFAULT 'note',
  aliases TEXT DEFAULT '[]',
  source_path TEXT,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS relations (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  dst TEXT NOT NULL,
  relation TEXT NOT NULL,
  evidence TEXT,
  source_path TEXT,
  valid_from TEXT,
  valid_to TEXT,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS source_files (
  path TEXT PRIMARY KEY,
  sha256 TEXT NOT NULL,
  mtime REAL NOT NULL,
  indexed_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memory_kind ON memory_items(kind);
CREATE INDEX IF NOT EXISTS idx_memory_source ON memory_items(source_path);
CREATE INDEX IF NOT EXISTS idx_rel_src ON relations(src);
CREATE INDEX IF NOT EXISTS idx_rel_dst ON relations(dst);
"""

def now(): return datetime.now(timezone.utc).isoformat(timespec='seconds')
def sha(text): return hashlib.sha256(text.encode('utf-8', errors='ignore')).hexdigest()
def db():
    ROOT.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB)
    conn.executescript(SCHEMA)
    return conn

def should_skip(path):
    p = str(path).lower()
    return bool(set(path.parts) & EXCLUDE_PARTS) or path.name.startswith('.') or bool(SECRET_NAME_RE.search(p))

def rel(path):
    try: return str(path.relative_to(VAULT))
    except Exception: return str(path)

def tags_for(path, text):
    tags = []
    try: parts = path.relative_to(VAULT).parts
    except Exception: parts = path.parts
    if parts: tags.append(parts[0])
    if len(parts) > 1: tags.append(parts[1])
    for m in re.findall(r'(?m)(?:^|\s)#([A-Za-zА-Яа-я0-9_/-]{2,})', text): tags.append(m.strip('/'))
    return sorted(set(tags))[:20]

def note_title(path, text):
    m = HEADING_RE.search(text[:2000])
    return m.group(2).strip() if m else path.stem

def classify(path, text):
    p = rel(path).lower()
    n = path.name.lower()
    if 'user' in n or 'memory' in n or 'context-bootstrap' in p: return 'semantic'
    if '/meetings/' in '/' + p or 'daily' in p or 'дневник' in p: return 'episodic'
    if '/skills/' in '/' + p or 'runbook' in p or 'workflow' in p or 'методология' in p: return 'procedural'
    if '/projects/' in '/' + p: return 'project'
    if '/agents/' in '/' + p: return 'agent'
    return 'document'

def upsert_item(conn, kind, title, body, source_path, tags, importance=3, confidence=0.8):
    source_hash = sha(body)
    item_id = hashlib.sha256(f'{kind}:{source_path}'.encode()).hexdigest()[:24]
    sql = """
    INSERT INTO memory_items(id,kind,title,body,source_path,source_hash,importance,confidence,tags,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,title=excluded.title,body=excluded.body,source_hash=excluded.source_hash,
      importance=excluded.importance,confidence=excluded.confidence,tags=excluded.tags,updated_at=excluded.updated_at
    """
    conn.execute(sql, (item_id, kind, title, body[:MAX_DOC_CHARS], source_path, source_hash, importance, confidence, json.dumps(tags, ensure_ascii=False), now()))
    return item_id

def ingest_file(conn, path):
    text = path.read_text(encoding='utf-8', errors='ignore')
    rpath = rel(path)
    digest = sha(text)
    st = path.stat()
    old = conn.execute('select sha256 from source_files where path=?', (rpath,)).fetchone()
    if old and old[0] == digest: return 'skip'
    title = note_title(path, text)
    kind = classify(path, text)
    tags = tags_for(path, text)
    upsert_item(conn, kind, title, text.strip(), rpath, tags, importance=4 if kind in {'semantic','project','agent'} else 3)
    ent_id = hashlib.sha256(('entity:'+title.lower()).encode()).hexdigest()[:24]
    conn.execute("insert into entities(id,name,entity_type,aliases,source_path,updated_at) values(?,?,?,?,?,?) on conflict(id) do update set name=excluded.name,entity_type=excluded.entity_type,source_path=excluded.source_path,updated_at=excluded.updated_at", (ent_id, title, kind, json.dumps([path.stem], ensure_ascii=False), rpath, now()))
    for target in sorted(set(WIKILINK_RE.findall(text))):
        dst = target.strip()
        if not dst: continue
        rid = hashlib.sha256(f'{title}->mentions->{dst}:{rpath}'.encode()).hexdigest()[:24]
        conn.execute('insert or replace into relations(id,src,dst,relation,evidence,source_path,updated_at) values(?,?,?,?,?,?,?)', (rid, title, dst, 'mentions', f'[[{dst}]]', rpath, now()))
    conn.execute('insert or replace into source_files(path,sha256,mtime,indexed_at) values(?,?,?,?)', (rpath, digest, st.st_mtime, now()))
    return 'indexed'

def ingest_vault(args):
    conn = db(); count = {'indexed':0,'skip':0,'error':0}
    for path in VAULT.rglob('*.md'):
        if should_skip(path): continue
        try: count[ingest_file(conn, path)] += 1
        except Exception as e:
            count['error'] += 1
            if args.verbose: print(f'ERROR {path}: {e}', file=sys.stderr)
    conn.commit()
    print(json.dumps({'db':str(DB),'vault':str(VAULT),**count}, ensure_ascii=False))

def fts_query(text):
    terms = re.findall(r'[A-Za-zА-Яа-я0-9_-]{3,}', text.lower())
    if not terms:
        return text.strip()
    return ' OR '.join(dict.fromkeys(terms))

def query(args):
    conn = db(); q = fts_query(args.query)
    sql = """select memory_items.kind, memory_items.title, memory_items.source_path, snippet(memory_fts, 1, '[', ']', ' ... ', 18), bm25(memory_fts)
    from memory_fts join memory_items on memory_fts.rowid = memory_items.rowid where memory_fts match ? order by 5 limit ?"""
    for kind,title,path,snip,rank in conn.execute(sql, (q, args.limit)).fetchall(): print(f'{kind} | {title} | {path}\n{snip}\n')

def context_pack(args):
    conn = db(); raw = args.query.strip(); q = fts_query(raw)
    sql = """select memory_items.kind, memory_items.title, memory_items.source_path, snippet(memory_fts, 1, '', '', ' ... ', 28)
    from memory_fts join memory_items on memory_fts.rowid = memory_items.rowid where memory_fts match ? order by bm25(memory_fts) limit ?"""
    rows = conn.execute(sql, (q, args.limit)).fetchall()
    rels = []
    for title in [r[1] for r in rows[:5]]: rels.extend(conn.execute('select src,dst,relation,source_path from relations where src=? or dst=? limit 10', (title,title)).fetchall())
    pack = {'query':raw,'generated_at':now(),'items':[{'kind':k,'title':t,'path':p,'snippet':s} for k,t,p,s in rows],'relations':[{'src':a,'dst':b,'relation':c,'path':d} for a,b,c,d in rels[:30]],'rule':'Вставлять в промпт только этот компактный пакет, а не всю базу.'}
    print(json.dumps(pack, ensure_ascii=False, indent=2))

def stats(args):
    conn = db(); out = {}
    for table in ['memory_items','entities','relations','source_files']: out[table] = conn.execute(f'select count(*) from {table}').fetchone()[0]
    out['by_kind'] = dict(conn.execute('select kind,count(*) from memory_items group by kind').fetchall())
    out['db'] = str(DB)
    print(json.dumps(out, ensure_ascii=False, indent=2))

def add_fact(args):
    conn = db(); tags = [t.strip() for t in args.tags.split(',') if t.strip()]
    upsert_item(conn, 'semantic', args.title, args.body, f'manual:{sha(args.title)[:12]}', tags, importance=args.importance, confidence=1.0)
    conn.commit(); print('ok')

def main():
    p = argparse.ArgumentParser(description='Local context memory for agents')
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('init')
    ing = sub.add_parser('ingest-vault'); ing.add_argument('--verbose', action='store_true')
    q = sub.add_parser('query'); q.add_argument('query'); q.add_argument('--limit', type=int, default=8)
    cp = sub.add_parser('context-pack'); cp.add_argument('query'); cp.add_argument('--limit', type=int, default=10)
    sub.add_parser('stats')
    af = sub.add_parser('add-fact'); af.add_argument('title'); af.add_argument('body'); af.add_argument('--tags', default=''); af.add_argument('--importance', type=int, default=4)
    args = p.parse_args()
    if args.cmd == 'init': conn = db(); conn.commit(); print(str(DB))
    elif args.cmd == 'ingest-vault': ingest_vault(args)
    elif args.cmd == 'query': query(args)
    elif args.cmd == 'context-pack': context_pack(args)
    elif args.cmd == 'stats': stats(args)
    elif args.cmd == 'add-fact': add_fact(args)

if __name__ == '__main__': main()
