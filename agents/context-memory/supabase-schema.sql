create table if not exists public.agent_memory_items (
  id text primary key,
  kind text not null,
  title text not null,
  body text not null,
  source_path text,
  source_hash text,
  importance integer default 3,
  confidence double precision default 0.8,
  valid_from timestamptz,
  valid_to timestamptz,
  tags jsonb default '[]'::jsonb,
  updated_at timestamptz not null
);

create table if not exists public.agent_memory_entities (
  id text primary key,
  name text not null,
  entity_type text default 'note',
  aliases jsonb default '[]'::jsonb,
  source_path text,
  updated_at timestamptz not null
);

create table if not exists public.agent_memory_relations (
  id text primary key,
  src text not null,
  dst text not null,
  relation text not null,
  evidence text,
  source_path text,
  valid_from timestamptz,
  valid_to timestamptz,
  updated_at timestamptz not null
);

create index if not exists agent_memory_items_kind_idx on public.agent_memory_items(kind);
create index if not exists agent_memory_items_source_idx on public.agent_memory_items(source_path);
create index if not exists agent_memory_items_body_gin_idx on public.agent_memory_items using gin(to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(body,'')));
create index if not exists agent_memory_relations_src_idx on public.agent_memory_relations(src);
create index if not exists agent_memory_relations_dst_idx on public.agent_memory_relations(dst);

alter table public.agent_memory_items enable row level security;
alter table public.agent_memory_entities enable row level security;
alter table public.agent_memory_relations enable row level security;
