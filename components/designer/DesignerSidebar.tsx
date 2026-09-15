"use client";

import type { FullInvitationConfig, InvitationTheme, EntryAnimation, PhotoScrollBehavior, FreeElement, SectionBlockType, SectionBlock } from "@/lib/mock-data";
import { defaultTheme, FONT_DISPLAY_OPTIONS, FONT_BODY_OPTIONS } from "@/lib/mock-data";
import { useState } from "react";
import ColorPicker from "./ColorPicker";
import SectionCatalog from "./SectionCatalog";
import SectionList from "./SectionList";
import SectionDesignList from "./SectionDesignList";
import StylesPanel from "./StylesPanel";

interface DesignerSidebarProps {
  config: FullInvitationConfig;
  originalSlug: string;
  onChange: (next: FullInvitationConfig) => void;
  onSave: () => void;
  saved: boolean;
}

const PALETTE_PRESETS: { name: string; theme: InvitationTheme }[] = [
  {
    name: "Botánico",
    theme: { primary: "#22342A", secondary: "#182620", paper: "#F4EFE4", accent: "#B08D3F", accentLight: "#D9C48B" },
  },
  {
    name: "Azul marino",
    theme: { primary: "#1B2A4A", secondary: "#121E35", paper: "#F0F4FF", accent: "#4A90D9", accentLight: "#93C5FD" },
  },
  {
    name: "Rosa nude",
    theme: { primary: "#5C3D3D", secondary: "#3D2424", paper: "#FDF5F0", accent: "#C47C5A", accentLight: "#E8B89A" },
  },
  {
    name: "Lila",
    theme: { primary: "#2D1B69", secondary: "#1A0F45", paper: "#FAF0FF", accent: "#9B59B6", accentLight: "#C39BD3" },
  },
  {
    name: "Terracota",
    theme: { primary: "#4A2010", secondary: "#2E1008", paper: "#FFF8F4", accent: "#C0522A", accentLight: "#E08060" },
  },
];

function Field({
  label,
  value,
  string,
  onChange,
  placeholder,
  type = "text",
  picker = false,
}: {
  label: string;
  value?: string;
  string?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  picker?: boolean;
}) {
  const inputValue = string ?? value ?? "";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>
      <input
        type={picker ? "datetime-local" : type}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );
}

export default function DesignerSidebar({
  config,
  onChange,
  onSave,
  saved,
}: DesignerSidebarProps) {
  const update = (partial: Partial<FullInvitationConfig>) =>
    onChange({ ...config, ...partial });

  const updateTheme = (partial: Partial<InvitationTheme>) =>
    onChange({ ...config, theme: { ...config.theme, ...partial } });

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(config.slug);

  const [activeTab, setActiveTab] = useState<"sections" | "styles" | "design">("sections");

  const addSection = (type: SectionBlockType) => {
    const newSection: SectionBlock = {
      id: Math.random().toString(36).slice(2, 9),
      type
    };
    onChange({ ...config, sections: [...(config.sections || []), newSection] });
  };

  return (
    <div className="flex flex-col h-full overflow-y-hidden">
      {/* Tabs Header */}
      <div className="flex px-4 pt-4 border-b border-white/10 shrink-0 gap-1">
        <button
          onClick={() => setActiveTab("sections")}
          className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === "sections" ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          Paneles
        </button>
        <button
          onClick={() => setActiveTab("styles")}
          className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === "styles" ? "border-amber-400 text-amber-300" : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          Estilos
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === "design" ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          Diseño
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {activeTab === "sections" && (
          <div className="flex flex-col gap-6 p-5">
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Tu Invitación
              </p>
              <p className="text-xs text-white/50 mb-3 leading-relaxed">
                Arrastra los paneles para reordenarlos. Configura cada uno desde su menú.
              </p>
              <SectionList sections={config.sections || []} onChange={(s) => update({ sections: s })} />
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Agregar Panel
              </p>
              <SectionCatalog onAdd={addSection} />
            </div>
          </div>
        )}

        {activeTab === "styles" && (
          <StylesPanel config={config} onChange={onChange} />
        )}

        {activeTab === "design" && (
          <>
            {/* Sección: Configuración de Paneles */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Configuración de Paneles
              </p>
              <SectionDesignList sections={config.sections || []} onChange={(s) => update({ sections: s })} />
            </div>

            {/* Sección: Datos del evento y Ubicación */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Datos del evento y Ubicación
              </p>
              <div className="flex flex-col gap-4">
                <Field
                  label="Nombre de los anfitriones"
                  value={config.anfitriones}
                  onChange={(v) => update({ anfitriones: v })}
                  placeholder="Sofía & Mateo"
                />
                <Field
                  label="Fecha legible"
                  value={config.fechaLegible}
                  onChange={(v) => update({ fechaLegible: v })}
                  placeholder="14 de noviembre, 2026"
                />
                <Field
                  label="Fecha ISO (para cuenta regresiva)"
                  value={config.fechaISO}
                  picker
                  onChange={(v) => update({ fechaISO: v })}
                  type="date"
                />

                {/* Subsección: Boda Religiosa / Misa */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2.5">
                  <p className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                    ⛪ Boda Religiosa (Misa)
                  </p>
                  <Field
                    label="Hora de la Misa"
                    value={config.ceremoniaHora}
                    onChange={(v) => update({ ceremoniaHora: v })}
                    placeholder="4:00 PM"
                  />
                  <Field
                    label="Lugar (Templo / Parroquia)"
                    value={config.ceremoniaLugar}
                    onChange={(v) => update({ ceremoniaLugar: v })}
                    placeholder="Parroquia de San José"
                  />
                  <Field
                    label="Dirección de la Misa"
                    value={config.ceremoniaDireccion}
                    onChange={(v) => update({ ceremoniaDireccion: v })}
                    placeholder="Av. Hidalgo #123, Centro"
                  />
                  <Field
                    label="Link Ubicación Google Maps (Misa)"
                    string={config.ceremoniaUrl}
                    onChange={(v) => update({ ceremoniaUrl: v })}
                    type="url"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                {/* Subsección: Recepción / Fiesta */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2.5">
                  <p className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                    🥂 Recepción & Fiesta
                  </p>
                  <Field
                    label="Hora de la Recepción"
                    value={config.recepcionHora}
                    onChange={(v) => update({ recepcionHora: v })}
                    placeholder="7:00 PM"
                  />
                  <Field
                    label="Lugar (Salón / Hacienda)"
                    value={config.recepcionLugar}
                    onChange={(v) => update({ recepcionLugar: v })}
                    placeholder="Hacienda Los Encinos"
                  />
                  <Field
                    label="Dirección de la Recepción"
                    value={config.recepcionDireccion}
                    onChange={(v) => update({ recepcionDireccion: v })}
                    placeholder="Camino a San Isidro 450"
                  />
                  <Field
                    label="Link Ubicación Google Maps (Recepción)"
                    string={config.recepcionUrl}
                    onChange={(v) => update({ recepcionUrl: v })}
                    type="url"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Mensaje de bienvenida
                  </label>
                  <textarea
                    value={config.mensaje}
                    onChange={(e) => update({ mensaje: e.target.value })}
                    rows={3}
                    placeholder=""
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Animación de Entrada */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Animación Inicial
              </p>
              <div className="flex flex-col gap-1.5">
                <select
                  value={config.entryAnimation || "carta"}
                  onChange={(e) => update({ entryAnimation: e.target.value as EntryAnimation })}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="carta">Abrir Carta</option>
                  <option value="disco">Disco (Giratorio)</option>
                  <option value="vinilo">Vinilo</option>
                  <option value="none">Ninguna</option>
                </select>
              </div>
            </div>

            {/* Sección: Galería */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Galería (URLs de fotos)
              </p>
              <div className="flex flex-col gap-2">
                {(config.fotos && config.fotos.length > 0 ? config.fotos : ["", "", ""]).map((url, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={url ?? ""}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        const fotos = [...(config.fotos || ["", "", ""])];
                        fotos[i] = newUrl;

                        const photoConfigs = [...(config.photoConfigs || [])];
                        while (photoConfigs.length <= i) {
                          photoConfigs.push({ url: "", scrollBehavior: "normal", displayMode: "galeria" });
                        }
                        photoConfigs[i] = {
                          ...photoConfigs[i],
                          url: newUrl,
                          displayMode: photoConfigs[i]?.displayMode || "galeria",
                          scrollBehavior: photoConfigs[i]?.scrollBehavior || "normal",
                        };

                        update({ fotos, photoConfigs });
                      }}
                      placeholder={`URL foto ${i + 1}`}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    {(config.fotos?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const fotos = config.fotos.filter((_, idx) => idx !== i);
                          const photoConfigs = (config.photoConfigs || []).filter((_, idx) => idx !== i);
                          update({ fotos, photoConfigs });
                        }}
                        className="px-2 py-2 text-xs text-red-400/60 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                        title="Eliminar foto"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const fotos = [...(config.fotos || []), ""];
                    const photoConfigs = [
                      ...(config.photoConfigs || []),
                      { url: "", scrollBehavior: "normal" as const, displayMode: "galeria" as const }
                    ];
                    update({ fotos, photoConfigs });
                  }}
                  className="mt-1 w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-1.5 text-xs text-white/70 transition-colors"
                >
                  + Agregar otra foto
                </button>
              </div>
            </div>

            {/* Sección: Paleta rápida */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Paleta rápida
              </p>
              <div className="flex flex-wrap gap-2">
                {PALETTE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updateTheme(preset.theme)}
                    title={preset.name}
                    className="flex gap-1 items-center rounded-lg px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all"
                  >
                    {[preset.theme.primary, preset.theme.paper, preset.theme.accent].map((c) => (
                      <span
                        key={c}
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <span className="text-[10px] text-white/50 ml-1">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sección: Tipografía */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Tipografía
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Títulos</label>
                  <select
                    value={config.theme.fontDisplay || "fraunces"}
                    onChange={(e) => updateTheme({ fontDisplay: e.target.value })}
                    className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    {FONT_DISPLAY_OPTIONS.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Textos largos</label>
                  <select
                    value={config.theme.fontBody || "work-sans"}
                    onChange={(e) => updateTheme({ fontBody: e.target.value })}
                    className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    {FONT_BODY_OPTIONS.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Colores personalizados */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Colores personalizados
              </p>
              <div className="flex flex-col gap-3">
                <ColorPicker label="Fondo principal" value={config.theme.primary} onChange={(v) => updateTheme({ primary: v })} />
                <ColorPicker label="Fondo secundario" value={config.theme.secondary} onChange={(v) => updateTheme({ secondary: v })} />
                <ColorPicker label="Color claro / papel" value={config.theme.paper} onChange={(v) => updateTheme({ paper: v })} />
                <ColorPicker label="Acento (dorado)" value={config.theme.accent} onChange={(v) => updateTheme({ accent: v })} />
                <ColorPicker label="Acento suave" value={config.theme.accentLight} onChange={(v) => updateTheme({ accentLight: v })} />
              </div>
            </div>

            {/* Sección: Elementos Libres */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Elementos Libres
              </p>
              <p className="text-xs text-white/40 mb-3 leading-relaxed">
                Agrega elementos y arrástralos en la vista previa.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newEl: FreeElement = {
                      id: Math.random().toString(36).slice(2, 9),
                      type: "text",
                      content: "Nuevo Texto",
                      x: 50,
                      y: 50,
                      fontSize: 24,
                      color: config.theme.primary
                    };
                    update({ freeElements: [...(config.freeElements || []), newEl] });
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs text-white transition-colors"
                >
                  + Texto
                </button>
                <button
                  onClick={() => {
                    const newEl: FreeElement = {
                      id: Math.random().toString(36).slice(2, 9),
                      type: "image",
                      url: "https://via.placeholder.com/150",
                      width: 100,
                      x: 50,
                      y: 50
                    };
                    update({ freeElements: [...(config.freeElements || []), newEl] });
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs text-white transition-colors"
                >
                  + Imagen
                </button>
              </div>
              {(config.freeElements?.length || 0) > 0 && (
                <div className="mt-3 flex flex-col gap-2.5">
                  {config.freeElements!.map(el => (
                    <div key={el.id} className="flex flex-col gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-center pb-1 border-b border-white/5">
                        <span className="text-[10px] uppercase text-amber-300/80 font-bold tracking-wider">
                          {el.type === "text" ? "📝 Texto Libre" : "🖼️ Imagen Libre"}
                        </span>
                        <button
                          onClick={() => update({ freeElements: config.freeElements!.filter(e => e.id !== el.id) })}
                          className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-wider"
                        >
                          Eliminar
                        </button>
                      </div>

                      {el.type === "text" ? (
                        <>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-white/50 uppercase">Texto</label>
                            <textarea
                              value={el.content || ""}
                              onChange={(e) => {
                                const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, content: e.target.value } : e2);
                                update({ freeElements: newElements });
                              }}
                              rows={2}
                              placeholder="Escribe el texto..."
                              className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Tipo de Fuente */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-white/50 uppercase">Fuente</label>
                              <select
                                value={el.fontFamily || "fraunces"}
                                onChange={(e) => {
                                  const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, fontFamily: e.target.value } : e2);
                                  update({ freeElements: newElements });
                                }}
                                className="bg-[#111] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                              >
                                <optgroup label="Títulos / Display">
                                  {FONT_DISPLAY_OPTIONS.map(f => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="Cuerpo / Lectura">
                                  {FONT_BODY_OPTIONS.map(f => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>

                            {/* Color del Texto */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-white/50 uppercase">Color</label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={el.color || config.theme.primary}
                                  onChange={(e) => {
                                    const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, color: e.target.value } : e2);
                                    update({ freeElements: newElements });
                                  }}
                                  className="w-7 h-7 rounded border border-white/20 p-0 cursor-pointer bg-transparent"
                                />
                                <span className="text-[10px] text-white/60 font-mono">{el.color || config.theme.primary}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Tamaño de Letra */}
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] text-white/50 uppercase">
                                <span>Tamaño</span>
                                <span className="text-amber-300 font-mono">{el.fontSize || 24}px</span>
                              </div>
                              <input
                                type="range"
                                min="12"
                                max="72"
                                value={el.fontSize || 24}
                                onChange={(e) => {
                                  const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, fontSize: Number(e.target.value) } : e2);
                                  update({ freeElements: newElements });
                                }}
                                className="accent-amber-400"
                              />
                            </div>

                            {/* Ancho del Marco */}
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] text-white/50 uppercase">
                                <span>Ancho Caja</span>
                                <span className="text-amber-300 font-mono">{el.width || 260}px</span>
                              </div>
                              <input
                                type="range"
                                min="80"
                                max="380"
                                value={el.width || 260}
                                onChange={(e) => {
                                  const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, width: Number(e.target.value) } : e2);
                                  update({ freeElements: newElements });
                                }}
                                className="accent-amber-400"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-white/50 uppercase">URL Imagen</label>
                            <input
                              type="url"
                              value={el.url || ""}
                              onChange={(e) => {
                                const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, url: e.target.value } : e2);
                                update({ freeElements: newElements });
                              }}
                              placeholder="https://..."
                              className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] text-white/50 uppercase">
                              <span>Ancho de Imagen</span>
                              <span className="text-amber-300 font-mono">{el.width || 220}px</span>
                            </div>
                            <input
                              type="range"
                              min="60"
                              max="380"
                              value={el.width || 220}
                              onChange={(e) => {
                                const newElements = config.freeElements!.map(e2 => e2.id === el.id ? { ...e2, width: Number(e.target.value) } : e2);
                                update({ freeElements: newElements });
                              }}
                              className="accent-amber-400"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sección: Música de Fondo */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                🎵 Música de Fondo
              </p>
              <p className="text-xs text-white/40 mb-3 leading-relaxed">
                Pega el link de una canción de Spotify. Se reproducirá automáticamente cuando el invitado abra la invitación.
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  URL de Spotify
                </label>
                <input
                  type="url"
                  value={config.musicUrl || ""}
                  onChange={(e) => update({ musicUrl: e.target.value || undefined })}
                  placeholder="https://open.spotify.com/track/..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                />
                {config.musicUrl && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400/80">Canción configurada</span>
                    <button
                      type="button"
                      onClick={() => update({ musicUrl: undefined })}
                      className="ml-auto text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-wider"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sección: Link / slug */}
            <div className="px-5 py-4 border-b border-white/10">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
                Link de la invitación
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Slug (solo letras, números y guiones)
                </label>
                <div className="flex items-center gap-0 bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-colors">
                  <span className="px-2 py-2 text-xs text-white/30 whitespace-nowrap">/invitacion/</span>
                  <input
                    type="text"
                    value={config.slug}
                    onChange={(e) =>
                      update({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })
                    }
                    className="flex-1 bg-transparent py-2 pr-3 text-sm text-white focus:outline-none"
                    placeholder="mis-15-anos"
                  />
                </div>
                {!slugValid && config.slug.length > 0 && (
                  <p className="text-red-400 text-xs">Slug inválido (solo letras minúsculas, números y guiones)</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botón guardar */}
      <div className="px-5 py-4 shrink-0 bg-black/40 border-t border-white/10">
        <button
          onClick={onSave}
          disabled={!slugValid}
          className="w-full py-3 rounded-xl font-body text-sm uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: slugValid
              ? `linear-gradient(135deg, ${config.theme.accent}, ${config.theme.accentLight})`
              : undefined,
            backgroundColor: slugValid ? undefined : "#333",
            color: slugValid ? config.theme.secondary : "#666",
          }}
        >
          {saved ? "✓ Guardado" : "Guardar y publicar"}
        </button>
        {saved && (
          <p className="text-center text-xs text-white/40 mt-2">
            Disponible en:{" "}
            <span className="text-white/70">/invitacion/{config.slug}</span>
          </p>
        )}
      </div>
    </div>
  );
}
