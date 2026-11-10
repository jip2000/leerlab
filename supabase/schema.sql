-- WOORDWERK — database-opzet voor Supabase
-- Plak dit hele bestand in Supabase: SQL Editor → New query → Run.
-- Je kunt het veilig vaker draaien.

-- 1. Profiel per gebruiker (met abonnement: 'gratis' of 'plus')
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  plan text not null default 'gratis' check (plan in ('gratis', 'plus')),
  plus_tot timestamptz,
  created_at timestamptz not null default now()
);

-- 2. Synchronisatie: per gebruiker één back-up van al zijn gegevens
create table if not exists public.backups (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 3. Beveiliging (Row Level Security): iedereen ziet en wijzigt alleen zijn eigen rij
alter table public.profiles enable row level security;
alter table public.backups enable row level security;

drop policy if exists "eigen profiel lezen" on public.profiles;
create policy "eigen profiel lezen" on public.profiles for select using (auth.uid() = id);
-- Let op: gebruikers mogen hun eigen plan NIET wijzigen. Dat doet later alleen de betaalkoppeling (service role).

drop policy if exists "eigen back-up lezen" on public.backups;
create policy "eigen back-up lezen" on public.backups for select using (auth.uid() = user_id);
drop policy if exists "eigen back-up maken" on public.backups;
create policy "eigen back-up maken" on public.backups for insert with check (auth.uid() = user_id);
drop policy if exists "eigen back-up wijzigen" on public.backups;
create policy "eigen back-up wijzigen" on public.backups for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Bij een nieuw account automatisch een profiel maken
create or replace function public.maak_profiel() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
drop trigger if exists nieuw_account on auth.users;
create trigger nieuw_account after insert on auth.users for each row execute function public.maak_profiel();

-- 5. Je eigen account (en alles wat erbij hoort) verwijderen
create or replace function public.verwijder_mijn_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.verwijder_mijn_account() from public, anon;
grant execute on function public.verwijder_mijn_account() to authenticated;
