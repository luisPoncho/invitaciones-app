"use client";

import { useEffect, useState } from "react";
import type { InvitationTheme } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";

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
}

export default function CuentaRegresiva({ fechaISO, theme }: CuentaRegresivaProps) {
  const t = { ...defaultTheme, ...theme };
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
