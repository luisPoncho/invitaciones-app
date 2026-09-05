"use client";

import type { FreeElement } from "@/lib/mock-data";
import DraggableElement from "./DraggableElement";

interface FreeElementsLayerProps {
  elements: FreeElement[];
  isDesigner: boolean;
  onUpdateElement?: (id: string, updates: Partial<FreeElement>) => void;
}

export default function FreeElementsLayer({ elements, isDesigner, onUpdateElement }: FreeElementsLayerProps) {
  if (!elements || elements.length === 0) return null;

  return (
    <div className={`absolute inset-0 ${isDesigner ? '' : 'pointer-events-none'} z-40 overflow-hidden`}>
      {elements.map((el) => (
        <DraggableElement 
          key={el.id} 
          element={el} 
          isDesigner={isDesigner} 
          onUpdate={(updates) => onUpdateElement?.(el.id, updates)} 
        />
      ))}
    </div>
  );
} 
