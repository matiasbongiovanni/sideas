-- Módulo Asistente Personal — infraestructura de webhooks
-- Complementa asistente-schema.sql. Ejecutar en Supabase SQL Editor solo con
-- confirmación explícita de Mati.
--
-- ap_webhooks          → destinos salientes (n8n u otros) suscriptos a eventos del módulo
-- ap_webhook_entregas  → log de cada intento de entrega saliente
-- ap_webhook_entrantes → log de todo webhook entrante recibido en /api/asistente/webhooks/[origen]

create table if not exists ap_webhooks (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  url text not null,
  -- Lista de eventos suscriptos. '*' = todos.
  eventos text[] not null default array['*'],
  -- Secreto para firmar el payload (HMAC-SHA256, header x-sideas-signature).
  -- Si es null se usa ASISTENTE_WEBHOOK_SECRET; si no hay ninguno, se envía sin firma.
  secreto text,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists ap_webhook_entregas (
  id uuid primary key default gen_random_uuid(),
  webhook_id uuid references ap_webhooks(id) on delete cascade,
  evento text not null,
  payload jsonb not null default '{}'::jsonb,
  status_code integer,
  ok boolean not null default false,
  error text,
  duracion_ms integer,
  creado_en timestamptz not null default now()
);

create table if not exists ap_webhook_entrantes (
  id uuid primary key default gen_random_uuid(),
  origen text not null,
  evento text,
  payload jsonb not null default '{}'::jsonb,
  headers jsonb not null default '{}'::jsonb,
  firma_valida boolean not null default false,
  procesado boolean not null default false,
  creado_en timestamptz not null default now()
);

create index if not exists idx_ap_webhooks_activo on ap_webhooks(activo);
create index if not exists idx_ap_webhook_entregas_webhook on ap_webhook_entregas(webhook_id, creado_en desc);
create index if not exists idx_ap_webhook_entrantes_origen on ap_webhook_entrantes(origen, creado_en desc);

alter table ap_webhooks enable row level security;
alter table ap_webhook_entregas enable row level security;
alter table ap_webhook_entrantes enable row level security;

-- Deny-all: sin policies para anon/authenticated. Todo acceso pasa por
-- createAdminClient() (service role) desde el servidor Next.js.
