-- Módulo Asistente Personal (Mati) — tareas, contactos, correo, calendario, usuario
-- Alimentado por el agente n8n de asistente personal vía API (service role, nunca RLS-bypass desde cliente)
-- Ejecutar en Supabase SQL Editor solo con confirmación explícita de Mati.

create table if not exists ap_contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  email text,
  notas text,
  ultima_interaccion timestamptz,
  creado_en timestamptz not null default now()
);

create table if not exists ap_tareas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_progreso', 'hecha', 'cancelada')),
  prioridad text default 'normal' check (prioridad in ('baja', 'normal', 'alta', 'urgente')),
  fecha_limite timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists ap_correos (
  id uuid primary key default gen_random_uuid(),
  contacto_id uuid references ap_contactos(id) on delete set null,
  destinatario_email text not null,
  asunto text not null,
  cuerpo text,
  estado_envio text not null default 'enviado' check (estado_envio in ('enviado', 'fallido', 'programado')),
  enviado_en timestamptz not null default now()
);

create table if not exists ap_eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  inicio timestamptz not null,
  fin timestamptz not null,
  ubicacion text,
  fuente_externa_id text unique,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists ap_usuario (
  id text primary key default 'mati',
  nombre text not null default 'Matías Weschta',
  zona_horaria text not null default 'America/Argentina/Buenos_Aires',
  preferencias jsonb not null default '{}'::jsonb,
  actualizado_en timestamptz not null default now()
);

insert into ap_usuario (id) values ('mati') on conflict (id) do nothing;

create index if not exists idx_ap_tareas_estado on ap_tareas(estado);
create index if not exists idx_ap_correos_contacto on ap_correos(contacto_id);
create index if not exists idx_ap_eventos_inicio on ap_eventos(inicio);

alter table ap_contactos enable row level security;
alter table ap_tareas enable row level security;
alter table ap_correos enable row level security;
alter table ap_eventos enable row level security;
alter table ap_usuario enable row level security;

-- Deny-all: sin policies para anon/authenticated. Todo acceso pasa por
-- createAdminClient() (service role) desde el servidor Next.js.
