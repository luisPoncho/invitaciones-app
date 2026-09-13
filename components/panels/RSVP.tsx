"use client";

import { useState } from "react";
import type { InvitationTheme, PhotoScrollBehavior, StylePreset } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { saveRSVP } from "@/lib/storage";
import { formatImageUrl } from "@/lib/image-utils";
import { LeafDivider } from "./Ornaments";

interface RSVPProps {
  slug: string;
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function RSVP({
  slug,
  theme,
  stylePreset = "clasico",
  bgUrl,
  bgScrollBehavior,
  bgPositionX,
  bgPositionY,
  bgZoom,
}: RSVPProps) {
  const t = { ...defaultTheme, ...theme };
  const fontDisplay = getFontDisplayVar(t.fontDisplay);
  const fontBody = getFontBodyVar(t.fontBody);
  const formattedBgUrl = formatImageUrl(bgUrl);
  const isRomantico = stylePreset === "romantico";

  const bgAttachment =
    bgScrollBehavior === "fija" ? "fixed" :
    bgScrollBehavior === "movimiento" ? "fixed" :
    "scroll";
  const bgSize = bgZoom && bgZoom > 100 ? `${bgZoom}% auto` : bgScrollBehavior === "movimiento" ? "120%" : "cover";
  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  const [nombre, setNombre] = useState("");
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [pases, setPases] = useState<number>(1);
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
      await saveRSVP(slug, {
        nombre: nombre.trim(),
        asistencia,
        pases: asistencia === "si" ? Math.max(1, pases) : 0,
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

  if (isRomantico) {
    const sectionStyle = {
      backgroundColor: t.paper || "#FAF6EE",
      color: t.primary,
      ...(formattedBgUrl ? {
        backgroundImage: `url(${formattedBgUrl})`,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
        backgroundAttachment: bgAttachment,
      } : {}),
    };

    if (enviado) {
      return (
        <section style={sectionStyle} className="relative text-center py-20 px-6 overflow-hidden">
          {formattedBgUrl && <div className="absolute inset-0 bg-white/80 z-0" />}
          <div className="relative z-10 max-w-sm mx-auto bg-white/90 p-8 rounded-3xl border border-amber-200 shadow-sm">
            <p style={{ fontFamily: fontDisplay, color: t.primary }} className="italic text-3xl mb-2 font-normal">
              ¡Gracias, {nombre}!
            </p>
            <LeafDivider color={t.accent} />
            <p style={{ color: `${t.primary}cc`, fontFamily: fontBody }} className="text-sm mt-3">
              {asistencia === "si"
                ? `Tu confirmación para ${pases} ${pases === 1 ? 'persona (1 pase)' : `personas (${pases} pases)`} ha sido registrada con éxito.`
                : "Lamentamos que no puedas acompañarnos, gracias por avisarnos."}
            </p>
          </div>
        </section>
      );
    }

    return (
      <section style={sectionStyle} className="relative py-20 px-6 overflow-hidden">
        {formattedBgUrl && <div className="absolute inset-0 bg-white/80 z-0" />}
        <div className="relative z-10 max-w-md mx-auto">
          <p
            style={{ color: t.accent, fontFamily: fontBody }}
            className="text-xs uppercase tracking-[0.25em] text-center mb-1 font-medium"
          >
            R.S.V.P.
          </p>
          <h2 style={{ fontFamily: fontDisplay, color: t.primary }} className="italic text-4xl text-center mb-2 font-normal">
            Confirma tu asistencia
          </h2>
          <div className="my-3">
            <LeafDivider color={t.accent} />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderColor: `${t.accent}30`,
            }}
            className="mt-6 p-6 sm:p-8 rounded-3xl border shadow-sm flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5 text-left">
              <label style={{ fontFamily: fontBody, color: `${t.primary}99` }} className="text-xs uppercase tracking-wider font-medium">
                Nombre y Apellido
              </label>
              <input
                type="text"
                placeholder="Escribe tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  borderColor: `${t.accent}40`,
                  color: t.primary,
                  fontFamily: fontBody,
                }}
                className="bg-white border rounded-xl px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label style={{ fontFamily: fontBody, color: `${t.primary}99` }} className="text-xs uppercase tracking-wider font-medium">
                ¿Nos acompañas?
              </label>
              <div className="flex gap-3">
                {(["si", "no"] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAsistencia(val)}
                    style={
                      asistencia === val
                        ? { backgroundColor: t.accent, color: "#FFFFFF", borderColor: t.accent, fontFamily: fontBody }
                        : { borderColor: `${t.accent}40`, color: t.primary, backgroundColor: "white", fontFamily: fontBody }
                    }
                    className="flex-1 rounded-xl border px-4 py-3 text-xs uppercase tracking-wider font-medium transition-all shadow-xs"
                  >
                    {val === "si" ? "✓ Sí asistiré" : "✕ No podré"}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Pases (cuando confirma que sí asiste) */}
            {asistencia === "si" && (
              <div className="flex flex-col gap-2 text-left bg-white/80 p-4 rounded-2xl border border-amber-200/60 transition-all animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label style={{ fontFamily: fontBody, color: t.primary }} className="text-xs uppercase tracking-wider font-semibold">
                    Pases / Personas
                  </label>
                  <span style={{ color: t.accent, fontFamily: fontBody }} className="text-xs font-bold">
                    {pases} {pases === 1 ? 'pase' : 'pases'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPases(prev => Math.max(1, prev - 1))}
                    disabled={pases <= 1}
                    style={{ borderColor: `${t.accent}40`, color: t.accent }}
                    className="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-base font-bold shadow-xs hover:bg-amber-50 transition-colors disabled:opacity-40"
                  >
                    -
                  </button>

                  <div className="flex-1 flex gap-1.5 justify-center overflow-x-auto py-0.5">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPases(num)}
                        style={
                          pases === num
                            ? { backgroundColor: t.accent, color: "#FFFFFF", borderColor: t.accent }
                            : { borderColor: `${t.accent}30`, color: t.primary, backgroundColor: "white" }
                        }
                        className="w-8 h-8 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all shadow-xs"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPases(prev => Math.min(20, prev + 1))}
                    style={{ borderColor: `${t.accent}40`, color: t.accent }}
                    className="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-base font-bold shadow-xs hover:bg-amber-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-xs font-medium" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              style={{ backgroundColor: t.accent, color: "#FFFFFF", fontFamily: fontBody }}
              className="mt-2 text-xs uppercase tracking-widest rounded-xl px-6 py-3.5 hover:opacity-90 transition-all font-medium shadow-md disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Confirmar Asistencia"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const sectionStyle = {
    backgroundColor: t.primary,
    color: t.paper,
    ...(formattedBgUrl ? {
      backgroundImage: `url(${formattedBgUrl})`,
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
            {asistencia === "si"
              ? `Tu confirmación para ${pases} ${pases === 1 ? 'persona (1 pase)' : `personas (${pases} pases)`} ha sido registrada.`
              : "Tu respuesta fue registrada."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle} className="relative">
      {bgUrl && <div className="absolute inset-0 bg-black/50 z-0" />}
      <div className="relative z-10 py-20 px-6">
        <h2 style={{ fontFamily: fontDisplay }} className="italic text-3xl text-center mb-8">
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

          {/* Selector de Pases Clásico */}
          {asistencia === "si" && (
            <div className="flex flex-col gap-2 text-left bg-white/5 p-3 rounded-lg border border-white/10 transition-all animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="uppercase tracking-wider">Pases a confirmar:</span>
                <span style={{ color: t.accentLight }} className="font-bold">
                  {pases} {pases === 1 ? 'pase' : 'pases'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPases(prev => Math.max(1, prev - 1))}
                  disabled={pases <= 1}
                  className="w-8 h-8 rounded border border-white/20 bg-white/5 flex items-center justify-center text-sm font-bold text-white hover:bg-white/10 disabled:opacity-30"
                >
                  -
                </button>

                <div className="flex-1 flex gap-1 justify-center overflow-x-auto py-0.5">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPases(num)}
                      style={
                        pases === num
                          ? { backgroundColor: t.accentLight, color: t.secondary, borderColor: t.accentLight }
                          : { borderColor: "rgba(255,255,255,0.15)", color: t.paper }
                      }
                      className="w-7 h-7 rounded border text-xs font-medium flex items-center justify-center transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPases(prev => Math.min(20, prev + 1))}
                  className="w-8 h-8 rounded border border-white/20 bg-white/5 flex items-center justify-center text-sm font-bold text-white hover:bg-white/10"
                >
                  +
                </button>
              </div>
            </div>
          )}

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
