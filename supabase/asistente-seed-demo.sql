-- Datos ficticios para mostrar el módulo Asistente Personal (Mati) en demo
-- Ejecutar en Supabase SQL Editor solo con confirmación explícita de Mati.
-- Requiere haber corrido antes asistente-schema.sql.

-- Contactos
insert into ap_contactos (id, nombre, telefono, email, notas, ultima_interaccion) values
  ('a1111111-1111-1111-1111-111111111111', 'Cintia Degliangioli (Multilab)', '+543511234567', 'cintia@multilab.com.ar', 'Directora Multilab. Coordinar entrega informe mensual.', now() - interval '2 days'),
  ('a2222222-2222-2222-2222-222222222222', 'Jorge Ruiz (DentalQuality)', '+549115556677', 'jorge@dentalquality.com', 'Dueño clínica. Pendiente feedback landing autogestión.', now() - interval '5 hours'),
  ('a3333333-3333-3333-3333-333333333333', 'Federico Gómez (Ingenia SA)', '+543518889900', 'fgomez@ingenia.com.ar', 'Contacto portal clientes SIDEAS, sede Jesús María.', now() - interval '1 day'),
  ('a4444444-4444-4444-4444-444444444444', 'Lucía Fernández (Aplus Construction)', '+15551234567', 'lucia@aplusconstruction.com', 'Seguimiento leads GC, USA.', now() - interval '3 days')
on conflict (id) do nothing;

-- Tareas
insert into ap_tareas (titulo, descripcion, estado, prioridad, fecha_limite) values
  ('Revisar propuesta SIDEAS admin usuarios', 'Confirmar alcance antes de mandar presupuesto.', 'en_progreso', 'alta', now() + interval '2 days'),
  ('Correr migración RLS core-tables CRM', 'auto-crm/supabase/migrations/2026-06-13-rls-core-tables.sql', 'pendiente', 'urgente', now() + interval '1 day'),
  ('Grabar VSL sprint ads propios', 'Guion 1 listo, falta grabación.', 'pendiente', 'alta', now() + interval '4 days'),
  ('Responder a Jorge (DentalQuality)', 'Feedback landing autogestión.', 'pendiente', 'normal', now() + interval '1 day'),
  ('Cerrar pago setup Núcleo ERP', 'Lead casa de iPhones, falta confirmar transferencia.', 'hecha', 'normal', now() - interval '1 day'),
  ('Preparar deck presentación Multilab', 'Actualizar capturas del portal de empresas.', 'cancelada', 'baja', now() - interval '3 days')
on conflict do nothing;

-- Correos
insert into ap_correos (contacto_id, destinatario_email, asunto, cuerpo, estado_envio, enviado_en) values
  ('a1111111-1111-1111-1111-111111111111', 'cintia@multilab.com.ar', 'Informe mensual listo', 'Hola Cintia, adjunto el informe de este mes. Cualquier cosa me escribís.', 'enviado', now() - interval '2 days'),
  ('a2222222-2222-2222-2222-222222222222', 'jorge@dentalquality.com', 'Seguimiento landing autogestión', 'Jorge, quedo atento a tu feedback del deploy nuevo.', 'enviado', now() - interval '5 hours'),
  ('a3333333-3333-3333-3333-333333333333', 'fgomez@ingenia.com.ar', 'Alta usuarios portal SIDEAS', 'Federico, ya di de alta a los 4 usuarios que me pasaste.', 'programado', now() + interval '1 day'),
  ('a4444444-4444-4444-4444-444444444444', 'lucia@aplusconstruction.com', 'Follow-up leads GC semana', 'Lucía, te paso el resumen de contactados esta semana.', 'fallido', now() - interval '3 days')
on conflict do nothing;

-- Eventos
insert into ap_eventos (titulo, descripcion, inicio, fin, ubicacion) values
  ('Call diagnóstico DentalQuality', 'Revisar bug agendamiento web.', now() + interval '1 day 2 hours', now() + interval '1 day 2 hours 30 minutes', 'Google Meet'),
  ('Reunión Multilab - entrega informe', 'Presentar portal de empresas.', now() + interval '2 days', now() + interval '2 days 1 hour', 'Oficina Multilab, Córdoba'),
  ('Grabación VSL sprint ads', 'Guion 1 - miedo/urgencia.', now() + interval '3 days', now() + interval '3 days 2 hours', 'Estudio Meteoro'),
  ('Sync semanal SIDEAS', 'Estado admin usuarios + portal clientes.', now() - interval '1 day', now() - interval '1 day' + interval '45 minutes', 'Google Meet')
on conflict do nothing;
