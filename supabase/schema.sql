create extension if not exists pgcrypto;

create table if not exists public.support_tickets (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    ticket_type text not null check (ticket_type in ('Bug', 'Feature', 'Question')),
    source text not null default 'webapp',
    status text not null default 'open',
    created_at timestamptz not null default now()
);

create index if not exists support_tickets_created_at_idx
    on public.support_tickets (created_at desc);
