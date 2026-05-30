// Script para crear usuario en Supabase
// Ejecutar: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node create-user.mjs

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas como variables de entorno");
  process.exit(1);
}

const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "hola.sideas.ia@gmail.com",
    password: "123456",
    email_confirm: true,
  }),
});

const data = await res.json();
console.log(res.status, JSON.stringify(data, null, 2));
