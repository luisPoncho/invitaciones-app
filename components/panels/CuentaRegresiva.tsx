"use client";

import { useEffect, useState } from "react";
import type { InvitationTheme, StylePreset } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { LeafDivider } from "./Ornaments";

function getTimeLeft(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    dias: Math.floor(diff / 86400000),
    horas: Math.floor((diff / 3600000) % 24),
    minutos: Math.floor((diff / 60000) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

interface CuentaRegresivaProps {
  fechaISO: string;
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
}

export default function CuentaRegresiva({ fechaISO, theme, stylePreset = "clasico" }: CuentaRegresivaProps) {
  const t = { ...defaultTheme, ...theme };
  const fontDisplay = getFontDisplayVar(t.fontDisplay);
  const fontBody = getFontBodyVar(t.fontBody);
  const isRomantico = stylePreset === "romantico";

  const [tiempo, setTiempo] = useState(() => getTimeLeft(fechaISO));

  useEffect(() => {
    const id = setInterval(() => setTiempo(getTimeLeft(fechaISO)), 1000);
    return () => clearInterval(id);
  }, [fechaISO]);

  const unidades: [string, number][] = [
    ["días", tiempo.dias],
    ["hrs", tiempo.horas],
    ["min", tiempo.minutos],
    ["seg", tiempo.segundos],
  ];

  if (isRomantico) {
    return (
      <section
        style={{
          backgroundColor: t.paper || "#FAF6EE",
          color: t.primary,
        }}
        className="relative py-16 px-6 text-center overflow-hidden"
      >
        <div className="max-w-md mx-auto">
          <p
            style={{ color: t.accent, fontFamily: fontBody }}
            className="text-xs tracking-[0.3em] uppercase mb-2 font-medium"
          >
            Esperando el gran día
          </p>
          <h3
            style={{ fontFamily: fontDisplay, color: t.primary }}
            className="text-3xl italic mb-3 font-normal"
          >
            Falta poco tiempo
          </h3>

          <div className="my-3">
            <LeafDivider color={t.accent} />
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mt-6">
            {unidades.map(([etiqueta, valor]) => (
              <div
                key={etiqueta}
                style={{
                  borderColor: `${t.accent}40`,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border shadow-sm backdrop-blur-xs transition-transform hover:-translate-y-0.5"
              >
                <span
                  style={{ color: t.accent, fontFamily: fontDisplay }}
                  className="text-3xl sm:text-4xl font-semibold leading-none"
                >
                  {String(valor).padStart(2, "0")}
                </span>
                <span
                  style={{ color: t.primary, fontFamily: fontBody }}
                  className="text-[10px] uppercase tracking-wider mt-1 font-medium opacity-80"
                >
                  {etiqueta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{ backgroundColor: t.paper }}
      className="py-16 px-6 text-center"
    >
      <p
        style={{ color: t.accent }}
        className="font-body text-xs tracking-[0.3em] uppercase mb-8"
      >
        Falta poco
      </p>
      <div className="flex justify-center gap-6 sm:gap-10">
        {unidades.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="flex flex-col items-center">
            <span
              style={{ color: t.primary }}
              className="font-display text-4xl sm:text-5xl"
            >
              {String(valor).padStart(2, "0")}
            </span>
            <span
              style={{ color: `${t.primary}99` }}
              className="font-body text-[11px] uppercase tracking-widest mt-1"
            >
              {etiqueta}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
