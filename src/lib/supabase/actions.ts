"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"

const PORTAL_EMAIL_DOMAIN = process.env.PORTAL_EMAIL_DOMAIN || "portal.sideasconsultores.com.ar"

function resolvePortalEmail(input: string): string {
    const trimmed = input.trim().toLowerCase()
    if (trimmed.includes("@")) return trimmed
    return `${trimmed}@${PORTAL_EMAIL_DOMAIN}`
}

export async function login(prevState: { error: string | null }, formData: FormData) {
    const supabase = await createClient()

    // Acepta tanto campo "username" (portal) como "email" (compat legacy)
    const rawInput = (formData.get("username") || formData.get("email")) as string
    const email = resolvePortalEmail(rawInput)
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        return { error: "Credenciales incorrectas. Verificá tu usuario y contraseña." }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/login")
}

export async function adminLogin(prevState: { error: string | null }, formData: FormData) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })

    if (error) {
        return { error: "Credenciales incorrectas. Verificá tu email y contraseña." }
    }

    if (!isAdminEmail(data.user.email)) {
        await supabase.auth.signOut()
        return { error: "No tenés permisos para acceder al panel privado de SIDEAS." }
    }

    revalidatePath("/", "layout")
    redirect("/admin")
}

export async function adminLogout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/admin/login")
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
