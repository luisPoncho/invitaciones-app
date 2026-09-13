"use client";

import type { FullInvitationConfig, StylePreset } from "@/lib/mock-data";
import { STYLE_PRESETS } from "@/lib/mock-data";

interface StylesPanelProps {
  config: FullInvitationConfig;
  onChange: (next: FullInvitationConfig) => void;
}

export default function StylesPanel({ config, onChange }: StylesPanelProps) {
  const currentStyle: StylePreset = config.stylePreset || "clasico";

  const handleSelectPreset = (presetId: StylePreset) => {
    if (presetId === "romantico") {
      // Switch style preset and offer optimal romantic defaults if user wants
      onChange({
        ...config,
        stylePreset: presetId,
      });
    } else {
      onChange({
        ...config,
        stylePreset: presetId,
      });
    }
  };

  const applyRecommendedTheme = (presetId: StylePreset) => {
    if (presetId === "romantico") {
      onChange({
        ...config,
        stylePreset: "romantico",
        theme: {
          ...config.theme,
          paper: "#FAF6EE",
          primary: "#2C221E",
          secondary: "#1F1916",
          accent: "#B08D3F",
          accentLight: "#D9C48B",
          fontDisplay: "great-vibes",
          fontBody: "work-sans",
        },
      });
    } else {
      onChange({
        ...config,
        stylePreset: "clasico",
        theme: {
          ...config.theme,
          primary: "#22342A",
          secondary: "#182620",
          paper: "#F4EFE4",
          accent: "#B08D3F",
          accentLight: "#D9C48B",
          fontDisplay: "fraunces",
          fontBody: "work-sans",
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <div>
        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">
          Estilos Visuales
        </p>
        <p className="text-xs text-white/60 leading-relaxed">
          Selecciona un estilo arquitectónico para transformar el diseño de todos los paneles de tu invitación.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = currentStyle === preset.id;
          return (
            <div
              key={preset.id}
              className={`rounded-2xl border transition-all p-4 flex flex-col gap-3 ${
                isSelected
                  ? "bg-white/10 border-amber-400/80 shadow-lg ring-1 ring-amber-400/50"
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
              }`}
            >
              {/* Header card */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {preset.id === "romantico" ? "🌸" : "✨"}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      {preset.name}
                    </h3>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
              </div>

              {/* Visual preview mini-card */}
              {preset.id === "romantico" ? (
                <div className="rounded-xl p-3 bg-[#FAF6EE] text-[#2C221E] border border-amber-200/40 relative overflow-hidden flex flex-col items-center text-center">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-[#B08D3F] font-serif font-bold">
                    Nuestra Boda
                  </div>
                  <div className="text-base italic font-serif text-[#2C221E] mt-0.5">
                    Diana & Tomás
                  </div>
                  <div className="w-16 h-px bg-[#B08D3F]/40 my-1.5" />
                  <div className="text-[9px] text-[#2C221E]/70 font-sans">
                    Ornamentos florales • Fondo crema • Elegancia Canva
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-3 bg-[#182620] text-[#F4EFE4] border border-white/10 relative overflow-hidden flex flex-col items-center text-center">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-[#D9C48B] font-serif font-bold">
                    Nuestra Boda
                  </div>
                  <div className="text-base italic font-serif text-[#F4EFE4] mt-0.5">
                    Diana & Tomás
                  </div>
                  <div className="w-16 h-px bg-[#B08D3F]/40 my-1.5" />
                  <div className="text-[9px] text-[#F4EFE4]/70 font-sans">
                    Diseño clásico editorial • Alto contraste • Estilo sobrio
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                    isSelected
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isSelected ? "Estilo Seleccionado" : "Usar este estilo"}
                </button>

                <button
                  type="button"
                  onClick={() => applyRecommendedTheme(preset.id)}
                  title="Aplica la tipografía y paleta de color recomendadas para este estilo"
                  className="py-2 px-3 rounded-lg text-xs text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 transition-all whitespace-nowrap"
                >
                  🎨 Paleta ideal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info notice */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex gap-3 items-start">
        <span className="text-base">💡</span>
        <p className="text-xs text-white/50 leading-relaxed">
          El estilo <strong className="text-white/80">Romántico Floral</strong> integra marcos ornamentales SVG, tipografías caligráficas y detalles florales idénticos a los diseños de invitaciones en Canva.
        </p>
      </div>
    </div>
  );
}
