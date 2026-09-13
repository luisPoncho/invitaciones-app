"use client";

import { useState } from "react";
import type { SectionBlock, PhotoScrollBehavior, ItineraryItem } from "@/lib/mock-data";
import { DEFAULT_ITINERARY_ITEMS } from "@/lib/mock-data";

interface SectionDesignListProps {
  sections: SectionBlock[];
  onChange: (newSections: SectionBlock[]) => void;
}

const SECTION_LABELS: Record<string, string> = {
  "portada": "Portada",
  "cuenta-regresiva": "Cuenta Regresiva",
  "itinerario": "Itinerario",
  "fecha-lugar": "Ubicación",
  "galeria": "Galería",
  "rsvp": "RSVP",
  "foto-fondo": "Foto de Fondo",
  "mesa-regalos": "Mesa de Regalos",
  "separador": "Separador",
  "texto-libre": "Texto Libre"
};

const QUICK_ICONS = ["⛪", "🥂", "🍽️", "💃", "🎵", "💐", "🍰", "✨", "📷", "🎆", "💍", "🚗"];

export default function SectionDesignList({ sections, onChange }: SectionDesignListProps) {
  const [editingBackground, setEditingBackground] = useState<Record<string, boolean>>({});

  const updateSection = (id: string, updates: Partial<SectionBlock>) => {
    onChange(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const configurableSections = sections.filter(sec => 
    ["portada", "fecha-lugar", "itinerario", "galeria", "rsvp", "foto-fondo", "mesa-regalos", "texto-libre"].includes(sec.type)
  );

  if (configurableSections.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {configurableSections.map((sec) => (
        <div key={sec.id} className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-[11px] font-semibold text-white/70 uppercase tracking-widest border-b border-white/10 pb-2 mb-1">
            {SECTION_LABELS[sec.type] || sec.type}
          </p>

          {sec.type === "galeria" && (
            <p className="text-xs text-white/50 leading-relaxed">
              Las fotos de la galería se configuran más abajo en la sección <strong>Galería (URLs de fotos)</strong>.
            </p>
          )}

          {/* Common Background Config */}
          {["portada", "fecha-lugar", "itinerario", "rsvp", "foto-fondo", "mesa-regalos", "texto-libre"].includes(sec.type) && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase">URL Imagen de Fondo</label>
                <input
                  type="url"
                  value={sec.type === 'foto-fondo' ? (sec.photoUrl || '') : (sec.bgUrl || '')}
                  onChange={(e) => updateSection(sec.id, sec.type === 'foto-fondo' ? { photoUrl: e.target.value } : { bgUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase">Comportamiento Fondo</label>
                <select
                  value={sec.bgScrollBehavior || "normal"}
                  onChange={(e) => updateSection(sec.id, { bgScrollBehavior: e.target.value as PhotoScrollBehavior })}
                  className="bg-[#111] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  <option value="normal">Normal</option>
                  <option value="fija">Fija (Parallax)</option>
                  <option value="movimiento">Movimiento Suave</option>
                </select>
              </div>
              <div className="border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBackground(current => ({ ...current, [sec.id]: !current[sec.id] }))}
                  className="flex w-full items-center justify-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition-colors hover:bg-white/10"
                >
                  <span aria-hidden="true">{editingBackground[sec.id] ? "✓" : "✎"}</span>
                  {editingBackground[sec.id] ? "Terminar edición" : "Editar encuadre"}
                </button>
                {editingBackground[sec.id] && (
                  <div className="mt-3 flex flex-col gap-3">
                    <label className="flex items-center justify-between gap-3 text-[10px] text-white/60 uppercase">
                      <span>Horizontal</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sec.bgPositionX ?? 50}
                        onChange={(e) => updateSection(sec.id, { bgPositionX: Number(e.target.value) })}
                        className="w-32 accent-white"
                      />
                      <output className="w-8 text-right text-white/80">{sec.bgPositionX ?? 50}%</output>
                    </label>
                    <label className="flex items-center justify-between gap-3 text-[10px] text-white/60 uppercase">
                      <span>Vertical</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sec.bgPositionY ?? 50}
                        onChange={(e) => updateSection(sec.id, { bgPositionY: Number(e.target.value) })}
                        className="w-32 accent-white"
                      />
                      <output className="w-8 text-right text-white/80">{sec.bgPositionY ?? 50}%</output>
                    </label>
                    <label className="flex items-center justify-between gap-3 text-[10px] text-white/60 uppercase">
                      <span>Zoom</span>
                      <input
                        type="range"
                        min="100"
                        max="220"
                        value={sec.bgZoom ?? 100}
                        onChange={(e) => updateSection(sec.id, { bgZoom: Number(e.target.value) })}
                        className="w-32 accent-white"
                      />
                      <output className="w-8 text-right text-white/80">{sec.bgZoom ?? 100}%</output>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Itinerario Specific Config */}
          {sec.type === "itinerario" && (
            <div className="flex flex-col gap-3 mt-2 border-t border-white/10 pt-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase">Título del Panel</label>
                <input
                  type="text"
                  value={sec.itineraryTitle ?? "Itinerario"}
                  onChange={(e) => updateSection(sec.id, { itineraryTitle: e.target.value })}
                  placeholder="Itinerario"
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase">Subtítulo</label>
                <input
                  type="text"
                  value={sec.itinerarySubtitle ?? "Cronograma del Gran Día"}
                  onChange={(e) => updateSection(sec.id, { itinerarySubtitle: e.target.value })}
                  placeholder="Cronograma del Gran Día"
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Eventos del Itinerario */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] text-white/50 uppercase font-semibold">Eventos / Horarios</label>
                
                {((sec.itineraryItems && sec.itineraryItems.length > 0) ? sec.itineraryItems : DEFAULT_ITINERARY_ITEMS).map((item, itemIdx, arr) => (
                  <div
                    key={item.id || itemIdx}
                    className="flex flex-col gap-2 bg-black/40 border border-white/10 rounded-lg p-2.5 relative"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.icon || "✨"}
                        onChange={(e) => {
                          const newItems = [...arr];
                          newItems[itemIdx] = { ...newItems[itemIdx], icon: e.target.value };
                          updateSection(sec.id, { itineraryItems: newItems });
                        }}
                        className="w-10 text-center bg-white/10 border border-white/10 rounded px-1 py-1 text-sm text-white focus:outline-none"
                        title="Emoji o ícono"
                      />
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const newItems = [...arr];
                          newItems[itemIdx] = { ...newItems[itemIdx], time: e.target.value };
                          updateSection(sec.id, { itineraryItems: newItems });
                        }}
                        placeholder="4:00 PM"
                        className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white font-medium focus:outline-none"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...arr];
                          newItems[itemIdx] = { ...newItems[itemIdx], title: e.target.value };
                          updateSection(sec.id, { itineraryItems: newItems });
                        }}
                        placeholder="Qué se va a hacer (Actividad)"
                        className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = arr.filter((_, idx) => idx !== itemIdx);
                          updateSection(sec.id, { itineraryItems: newItems });
                        }}
                        className="text-red-400/60 hover:text-red-400 hover:bg-white/10 rounded p-1 text-xs transition-colors"
                        title="Eliminar evento"
                      >
                        ✕
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => {
                        const newItems = [...arr];
                        newItems[itemIdx] = { ...newItems[itemIdx], description: e.target.value };
                        updateSection(sec.id, { itineraryItems: newItems });
                      }}
                      placeholder="Lugar o descripción opcional (ej: Salón Principal)"
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white/70 focus:outline-none"
                    />

                    {/* Quick emoji selection */}
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                      {QUICK_ICONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            const newItems = [...arr];
                            newItems[itemIdx] = { ...newItems[itemIdx], icon: emoji };
                            updateSection(sec.id, { itineraryItems: newItems });
                          }}
                          className={`text-xs px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${item.icon === emoji ? 'bg-white/20' : ''}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const currentItems = (sec.itineraryItems && sec.itineraryItems.length > 0) ? sec.itineraryItems : DEFAULT_ITINERARY_ITEMS;
                    const newItem: ItineraryItem = {
                      id: `it-${Date.now()}`,
                      time: "8:00 PM",
                      title: "Nuevo Evento",
                      description: "",
                      icon: "✨"
                    };
                    updateSection(sec.id, { itineraryItems: [...currentItems, newItem] });
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg py-2 text-xs text-white font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>+</span> Agregar Evento al Itinerario
                </button>
              </div>
            </div>
          )}

          {/* Texto Libre Specific Config */}
          {sec.type === "texto-libre" && (
            <>
              <div className="flex flex-col gap-1.5 mt-2 border-t border-white/10 pt-3">
                <label className="text-[10px] text-white/50 uppercase">Título</label>
                <input
                  type="text"
                  value={sec.customTitle || ''}
                  onChange={(e) => updateSection(sec.id, { customTitle: e.target.value })}
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase">Texto</label>
                <textarea
                  value={sec.customBody || ''}
                  onChange={(e) => updateSection(sec.id, { customBody: e.target.value })}
                  rows={3}
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>
            </>
          )}

          {/* Mesa de Regalos Specific Config */}
          {sec.type === "mesa-regalos" && (
            <>
              <div className="flex flex-col gap-1.5 mt-2 border-t border-white/10 pt-3">
                <label className="text-[10px] text-white/50 uppercase">Título Opcional</label>
                <input
                  type="text"
                  value={sec.giftRegistryTitle || ''}
                  onChange={(e) => updateSection(sec.id, { giftRegistryTitle: e.target.value })}
                  placeholder="Mesa de Regalos"
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/50 uppercase">Link / URL de la Mesa</label>
                <input
                  type="url"
                  value={sec.giftRegistryUrl || ''}
                  onChange={(e) => updateSection(sec.id, { giftRegistryUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
