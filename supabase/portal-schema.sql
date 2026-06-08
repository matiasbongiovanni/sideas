-- Portal de Clientes SIDEAS
-- Correr en el SQL editor del proyecto Supabase de SIDEAS.
-- Tablas: portal_clients, portal_profiles, portal_endpoints, portal_credentials

-- ============================================================
-- 1. portal_clients — uno por empresa cliente de SIDEAS
-- ============================================================
create table if not exists portal_clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

alter table portal_clients enable row level security;

-- Los usuarios de portal solo ven el cliente al que pertenecen
create policy "portal_clients: user sees own client"
  on portal_clients for select
  using (
    id in (
      select client_id from portal_profiles where user_id = auth.uid()
    )
  );

-- ============================================================
-- 2. portal_profiles — uno por usuario de Auth que es portal
-- ============================================================
create table if not exists portal_profiles (
  user_id    uuid primary key references auth.users on delete cascade,
  client_id  uuid not null references portal_clients on delete cascade,
  username   text not null unique,
  full_name  text not null,
  role       text not null default 'portal',
  created_at timestamptz not null default now()
);

alter table portal_profiles enable row level security;

-- Cada usuario solo ve su propio perfil
create policy "portal_profiles: user sees own profile"
  on portal_profiles for select
  using (user_id = auth.uid());

-- ============================================================
-- 3. portal_endpoints — portales asignados a un cliente
-- ============================================================
create table if not exists portal_endpoints (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references portal_clients on delete cascade,
  type       text not null check (type in ('inventario', 'zabbix')),
  label      text not null,
  base_url   text not null,
  auth_mode  text not null default 'per_user' check (auth_mode in ('per_user', 'shared', 'none')),
  enabled    boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  unique (client_id, type)
);

alter table portal_endpoints enable row level security;

-- Los usuarios ven solo los endpoints del cliente al que pertenecen
create policy "portal_endpoints: user sees client endpoints"
  on portal_endpoints for select
  using (
    client_id in (
      select client_id from portal_profiles where user_id = auth.uid()
    )
    and enabled = true
  );

-- Índice para lookups por cliente y tipo
create index if not exists idx_portal_endpoints_client_type
  on portal_endpoints (client_id, type);

-- ============================================================
-- 4. portal_credentials — credenciales de acceso al portal upstream
--    user_id NULL = credencial compartida (auth_mode='shared')
--    user_id NOT NULL = credencial per-user (auth_mode='per_user')
--    NOTA: Sin policy de SELECT — solo service role puede leer.
--    El browser nunca recibe estas credenciales.
-- ============================================================
create table if not exists portal_credentials (
  id           uuid primary key default gen_random_uuid(),
  endpoint_id  uuid not null references portal_endpoints on delete cascade,
  user_id      uuid references auth.users on delete cascade,
  username     text not null,
  password_enc text not null,
  created_at   timestamptz not null default now(),
  unique (endpoint_id, user_id)
);

alter table portal_credentials enable row level security;
-- Sin policies de lectura intencionalmente:
-- solo createAdminClient() (service role) puede leer estas credenciales.
-- El anon key / sesión de usuario nunca accede a esta tabla.

-- Índice para lookups rápidos en el proxy
create index if not exists idx_portal_credentials_endpoint_user
  on portal_credentials (endpoint_id, user_id);
