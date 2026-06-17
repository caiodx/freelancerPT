-- ============================================================
-- FreelancerPT — Schema SQL
-- Colar no SQL Editor do Supabase e executar
-- ============================================================

-- Extensão para UUIDs
create extension if not exists "uuid-ossp";

-- ─── USERS (perfil estendido do auth.users) ──────────────────
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  nome text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── CONFIGURACOES_FISCAIS ────────────────────────────────────
create table public.configuracoes_fiscais (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  -- Regime
  primeiro_ano boolean default false,           -- isenção SS automática
  isento_iva boolean default false,             -- Art.53.º ≤€15k/ano
  tem_retencao boolean default false,           -- 23% retido na fonte
  coeficiente numeric(4,2) default 0.75,        -- 0.75 serviços / 0.35 produto
  -- Prazos IVA
  periodicidade_iva text default 'trimestral',  -- 'trimestral' | 'mensal'
  -- Metas
  meta_reserva_pct numeric(5,2) default 44.00,  -- % do bruto a reservar
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── FATURAS ─────────────────────────────────────────────────
create table public.faturas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  -- Dados da fatura
  valor_base numeric(10,2) not null,            -- valor sem IVA
  valor_iva numeric(10,2) generated always as (
    case when valor_base > 0 then round(valor_base * 0.23, 2) else 0 end
  ) stored,
  valor_total numeric(10,2) generated always as (
    round(valor_base * 1.23, 2)
  ) stored,
  -- Impostos calculados (guardados para histórico)
  iva_a_guardar numeric(10,2) default 0,
  irs_a_guardar numeric(10,2) default 0,
  ss_a_guardar numeric(10,2) default 0,
  -- Metadata
  data_fatura date not null default current_date,
  cliente text,
  descricao text,
  numero_fatura text,
  -- Estado
  paga boolean default true,
  deleted_at timestamptz,                       -- soft delete
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── COFRE_REGISTOS (o que o utilizador já guardou) ──────────
create table public.cofre_registos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  tipo text not null check (tipo in ('iva', 'irs', 'ss')),
  valor numeric(10,2) not null,
  descricao text,                               -- ex: "depósito manual", "transferência"
  data date not null default current_date,
  created_at timestamptz default now()
);

-- ─── SUBSCRICOES ──────────────────────────────────────────────
create table public.subscricoes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  -- LemonSqueezy
  ls_subscription_id text,
  ls_customer_id text,
  ls_order_id text,
  -- Estado
  status text default 'trial' check (status in ('trial', 'active', 'cancelled', 'expired', 'paused')),
  plano text default 'mensal' check (plano in ('mensal', 'anual')),
  trial_ends_at timestamptz default (now() + interval '14 days'),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.configuracoes_fiscais enable row level security;
alter table public.faturas enable row level security;
alter table public.cofre_registos enable row level security;
alter table public.subscricoes enable row level security;

-- Users: cada um só vê o seu próprio perfil
create policy "users: own profile only"
  on public.users for all
  using (auth.uid() = id);

-- Configurações: só o próprio utilizador
create policy "config: own only"
  on public.configuracoes_fiscais for all
  using (auth.uid() = user_id);

-- Faturas: políticas separadas por operação (necessário para soft-delete funcionar)
-- O WITH CHECK de FOR ALL bloqueia updates que mudam deleted_at para NOT NULL
create policy "faturas: select own"
  on public.faturas for select
  using (auth.uid() = user_id and deleted_at is null);

create policy "faturas: insert own"
  on public.faturas for insert
  with check (auth.uid() = user_id);

create policy "faturas: update own"
  on public.faturas for update
  using (auth.uid() = user_id);

create policy "faturas: delete own"
  on public.faturas for delete
  using (auth.uid() = user_id);

-- Cofre: só o próprio utilizador
create policy "cofre: own only"
  on public.cofre_registos for all
  using (auth.uid() = user_id);

-- Subscrições: só o próprio utilizador
create policy "subscricoes: own only"
  on public.subscricoes for all
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: criar perfil e configurações após signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Criar perfil
  insert into public.users (id, email)
  values (new.id, new.email);

  -- Criar configurações fiscais com defaults
  insert into public.configuracoes_fiscais (user_id)
  values (new.id);

  -- Criar subscrição em trial
  insert into public.subscricoes (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ÍNDICES para performance
-- ============================================================

create index faturas_user_id_idx on public.faturas(user_id);
create index faturas_data_idx on public.faturas(data_fatura desc);
create index cofre_user_tipo_idx on public.cofre_registos(user_id, tipo);
create index cofre_data_idx on public.cofre_registos(data desc);
