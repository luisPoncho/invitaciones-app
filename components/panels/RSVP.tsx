"use client";

import { useState } from "react";
import type { InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { saveRSVP } from "@/lib/storage";

interface RSVPProps {
  slug: string;
  theme?: InvitationTheme;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function RSVP({ slug, theme, bgUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: RSVPProps) {
  const t = { ...defaultTheme, ...theme };
  const fontDisplay = getFontDisplayVar(t.fontDisplay);
  const fontBody = getFontBodyVar(t.fontBody);

  const bgAttachment =
    bgScrollBehavior === "fija" ? "fixed" :
    bgScrollBehavior === "movimiento" ? "fixed" :
    "scroll";
  const bgSize = bgZoom && bgZoom > 100 ? `${bgZoom}% auto` : bgScrollBehavior === "movimiento" ? "120%" : "cover";
  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  const [nombre, setNombre] = useState("");
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !asistencia) {
      setError("Completa tu nombre y confirma tu asistencia.");
      return;
    }
    setError("");
    setEnviando(true);

    try {
      // Guardar en el backend
      await saveRSVP(slug, {
        nombre: nombre.trim(),
        asistencia,
        timestamp: new Date().toISOString(),
      });
      setEnviado(true);
    } catch (err) {
      console.error("Error saving RSVP:", err);
      setError("Hubo un error al enviar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const sectionStyle = {
    backgroundColor: t.primary,
    color: t.paper,
    ...(bgUrl ? {
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: bgSize,
      backgroundPosition: bgPosition,
      backgroundAttachment: bgAttachment,
    } : {}),
  };

  if (enviado) {
    return (
      <section style={sectionStyle} className="relative text-center">
        {bgUrl && <div className="absolute inset-0 bg-black/50 z-0" />}
        <div className="relative z-10 py-20 px-6">
          <p style={{ fontFamily: fontDisplay }} className="italic text-2xl">¡Gracias, {nombre}!</p>
          <p style={{ color: `${t.paper}b3`, fontFamily: fontBody }} className="text-sm mt-2">
            Tu respuesta fue registrada.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle} className="relative">
      {bgUrl && <div className="absolute inset-0 bg-black/50 z-0" />}
      <div className="relative z-10 py-20 px-6">
      <h2 style={{ fontFamily: fontDisplay }} className="italic text-3xl text-center mb-10">
        Confirma tu asistencia
      </h2>
      <form onSubmit={handleSubmit} className="max-w-xs mx-auto flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tu nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            borderColor: `${t.accentLight}66`,
            color: t.paper,
            backgroundColor: "transparent",
            fontFamily: fontBody,
          }}
          className="border rounded-md px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none transition-opacity"
        />

        <div className="flex gap-3">
          {(["si", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAsistencia(val)}
              style={
                asistencia === val
                  ? { backgroundColor: t.accentLight, color: t.secondary, borderColor: t.accentLight, fontFamily: fontBody }
                  : { borderColor: `${t.accentLight}66`, color: t.paper, fontFamily: fontBody }
              }
              className="flex-1 rounded-md border px-4 py-3 text-sm uppercase tracking-wide transition-all"
            >
              {val === "si" ? "Sí asisto" : "No podré"}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-300 text-xs" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          style={{ backgroundColor: t.accent, color: t.paper, fontFamily: fontBody }}
          className="mt-2 text-sm uppercase tracking-widest rounded-md px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Enviar confirmación"}
        </button>
      </form>
      </div>
    </section>
  );
}
