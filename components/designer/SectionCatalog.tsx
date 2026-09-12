"use client";

import type { SectionBlockType } from "@/lib/mock-data";

interface SectionCatalogProps {
  onAdd: (type: SectionBlockType) => void;
}

const AVAILABLE_SECTIONS: { type: SectionBlockType; label: string; desc: string }[] = [
  { type: "portada", label: "Portada", desc: "Bienvenida y nombres" },
  { type: "cuenta-regresiva", label: "Cuenta Regresiva", desc: "Temporizador al evento" },
  { type: "fecha-lugar", label: "Itinerario y Ubicación", desc: "Misa religiosa, Recepción y sus botones de mapa" },
  { type: "galeria", label: "Galería", desc: "Grid de fotos" },
  { type: "rsvp", label: "Confirmación (RSVP)", desc: "Formulario de asistencia" },
  { type: "foto-fondo", label: "Foto de Fondo", desc: "Imagen a pantalla completa" },
  { type: "mesa-regalos", label: "Mesa de Regalos", desc: "Link para regalos" },
  { type: "separador", label: "Separador", desc: "Ornamento divisorio" },
  { type: "texto-libre", label: "Texto Libre", desc: "Párrafo personalizado" },
];

export default function SectionCatalog({ onAdd }: SectionCatalogProps) {
  return (
    <div className="flex flex-col gap-2">
      {AVAILABLE_SECTIONS.map((sec) => (
        <button
          key={sec.type}
          onClick={() => onAdd(sec.type)}
          className="flex flex-col items-start bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-lg p-3 text-left"
        >
          <span className="text-sm text-white font-medium">{sec.label}</span>
          <span className="text-[10px] text-white/50">{sec.desc}</span>
        </button>
      ))}
    </div>
  );
}
