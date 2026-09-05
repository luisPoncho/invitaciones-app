"use client";

import { useState } from "react";
import type { SectionBlock, PhotoScrollBehavior } from "@/lib/mock-data";

interface SectionListProps {
  sections: SectionBlock[];
  onChange: (newSections: SectionBlock[]) => void;
}

const SECTION_LABELS: Record<string, string> = {
  "portada": "Portada",
  "cuenta-regresiva": "Cuenta Regresiva",
  "fecha-lugar": "Fecha y Lugar",
  "galeria": "Galería",
  "rsvp": "RSVP",
  "foto-fondo": "Foto de Fondo",
  "mesa-regalos": "Mesa de Regalos",
  "separador": "Separador",
  "texto-libre": "Texto Libre"
};

export default function SectionList({ sections, onChange }: SectionListProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;
    
    const newSections = [...sections];
    const [moved] = newSections.splice(draggedIdx, 1);
    newSections.splice(dropIdx, 0, moved);
    
    onChange(newSections);
    setDraggedIdx(null);
  };


  const removeSection = (id: string) => {
    onChange(sections.filter(s => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {sections.map((sec, idx) => (
        <div
          key={sec.id}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={() => setDraggedIdx(null)}
          className={`flex flex-col bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all ${
            draggedIdx === idx ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {/* Header (Drag Handle) */}
          <div className="flex items-center justify-between p-3 bg-white/5 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 pointer-events-none">
              <span className="text-white/30">☰</span>
              <span className="text-sm text-white font-medium">{SECTION_LABELS[sec.type] || sec.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => removeSection(sec.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {sections.length === 0 && (
        <p className="text-xs text-white/30 text-center py-4">No hay secciones activas.</p>
      )}
    </div>
  );
}
