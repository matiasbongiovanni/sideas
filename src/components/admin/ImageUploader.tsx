"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Upload, X, Link2 } from "lucide-react"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: form })
      const json = await res.json() as { url?: string; error?: string }
      if (!res.ok) throw new Error(json.error ?? "Error al subir")
      onChange(json.url ?? "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) void upload(file)
  }, [upload])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void upload(file)
    e.target.value = ""
  }

  const hasImage = Boolean(value)

  return (
    <div className="space-y-3">
      {hasImage ? (
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
          <div className="relative aspect-[16/9]">
            <Image
              src={value}
              alt="Portada"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => { onChange(""); setShowUrlInput(false) }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
            aria-label="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-[#0B3C78]"
          >
            <Upload className="h-3 w-3" />
            Cambiar
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed px-6 py-10 transition-colors",
            dragging
              ? "border-[#4398FF] bg-[#EEF4FF]"
              : "border-slate-200 bg-slate-50 hover:border-[#4398FF]/50 hover:bg-slate-100",
          ].join(" ")}
        >
          {uploading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4398FF] border-t-transparent" />
              <p className="text-sm text-slate-500">Subiendo imagen...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#0B3C78]">
                <Upload className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-900">Arrastrá una imagen o hacé click</p>
                <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, GIF · Máx 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">{error}</p>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-[#0B3C78]"
        >
          <Link2 className="h-3 w-3" />
          {showUrlInput ? "Ocultar URL manual" : "O ingresá una URL de imagen"}
        </button>

        {showUrlInput && (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
          />
        )}
      </div>
    </div>
  )
}
