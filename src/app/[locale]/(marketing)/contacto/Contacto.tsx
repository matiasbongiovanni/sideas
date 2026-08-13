"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"

function buildContactSchema(t: ReturnType<typeof useTranslations<"Contacto">>) {
    return z.object({
        nombre: z.string().min(1, t("errorNombre")),
        telefono: z.string().optional(),
        email: z.string().email(t("errorEmail")),
        empresa: z.string().optional(),
        mensaje: z.string().min(10, t("errorMensaje")),
    })
}

type ContactFormData = z.infer<ReturnType<typeof buildContactSchema>>

export default function Contacto() {
    const t = useTranslations("Contacto")
    const contactSchema = useMemo(() => buildContactSchema(t), [t])
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: ContactFormData) => {
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error("Error al enviar el formulario")
            setSuccess(true)
            reset()
        } catch {
            setError(t("errorMsg"))
        }
    }

    return (
        <section id="contacto" className="relative py-24 bg-white overflow-hidden border-t border-slate-100">
            {/* Elemento decorativo de fondo */}
            <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-[#4398FF]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header Sincronizado */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-light sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
                        {t("titlePrefix")} <span className="font-bold">{t("titleBold")}</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg max-w-xl mx-auto text-slate-500 leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Mapa con estilo Premium */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200 group min-h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54451.12978889586!2d-64.21970005!3d-31.3990649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28e9a67f0e9%3A0x0!2sMQQ4%2B2H%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1712780000000!5m2!1ses!2sar"                       
                            className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.1] transition-all duration-500 group-hover:grayscale-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={t("mapTitle")}
                        />
                    </div>

                    {/* Formulario Estilizado */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/50 relative">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        {t("labelNombre")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("placeholderNombre")}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-[#4398FF] focus:bg-white focus:ring-4 focus:ring-[#4398FF]/5"
                                        {...register("nombre")}
                                    />
                                    {errors.nombre && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.nombre.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        {t("labelTelefono")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("placeholderTelefono")}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-[#4398FF] focus:bg-white focus:ring-4 focus:ring-[#4398FF]/5"
                                        {...register("telefono")}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        {t("labelEmail")}
                                    </label>
                                    <input
                                        type="email"
                                        placeholder={t("placeholderEmail")}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-[#4398FF] focus:bg-white focus:ring-4 focus:ring-[#4398FF]/5"
                                        {...register("email")}
                                    />
                                    {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        {t("labelEmpresa")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("placeholderEmpresa")}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-[#4398FF] focus:bg-white focus:ring-4 focus:ring-[#4398FF]/5"
                                        {...register("empresa")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    {t("labelMensaje")}
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-[#4398FF] focus:bg-white focus:ring-4 focus:ring-[#4398FF]/5 resize-none"
                                    placeholder={t("placeholderMensaje")}
                                    {...register("mensaje")}
                                />
                                {errors.mensaje && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.mensaje.message}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group w-full flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#4398FF]/40 disabled:opacity-50 disabled:scale-100"
                                >
                                    {isSubmitting ? t("submitting") : t("submit")}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>

                            {error && <p className="text-center text-xs font-bold text-red-500 uppercase">{error}</p>}
                            {success && <p className="text-center text-xs font-bold text-green-600 uppercase tracking-widest animate-pulse">{t("successMsg")}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}