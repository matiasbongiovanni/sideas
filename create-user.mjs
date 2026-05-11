// Script para crear usuario en Supabase
// Ejecutar: node create-user.mjs

const SUPABASE_URL = "https://pamdsyjbfykbmwawlgxj.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbWRzeWpiZnlrYm13YXdsZ3hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc5MjkzNSwiZXhwIjoyMDkxMzY4OTM1fQ.UZEPnt_F5gpupdBUtHM5pTg-cRxmBqtPCXwokytDgkg";

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
