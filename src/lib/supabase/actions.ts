"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"

export async function login(prevState: { error: string | null }, formData: FormData) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })

    if (error) {
        return { error: "Credenciales incorrectas. Verificá tu email y contraseña." }
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
