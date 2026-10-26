"use client";

import type { FreeElement } from "@/lib/mock-data";
import DraggableElement from "./DraggableElement";

/**
 * Capa de elementos libres. Debe renderizarse dentro de <DesignCanvas>:
 * los valores absolutos (width, height, fontSize, imageX, imageY) están en
 * px de diseño y el canvas se encarga de escalarlos uniformemente junto con
 * el resto de la invitación. x/y son porcentajes de esta capa.
 */

interface FreeElementsLayerProps {
  elements: FreeElement[];
  isDesigner: boolean;
  onUpdateElement?: (id: string, updates: Partial<FreeElement>) => void;
  onDeleteElement?: (id: string) => void;
}

export default function FreeElementsLayer({
  elements,
  isDesigner,
  onUpdateElement,
  onDeleteElement,
}: FreeElementsLayerProps) {
  if (!elements || elements.length === 0) return null;

  const sortedElements = [...elements].sort(
    (a, b) => (a.zIndex ?? 50) - (b.zIndex ?? 50)
  );

  // La capa nunca captura clics: solo los elementos (en el diseñador) los reciben,
  // así las secciones de abajo siguen siendo interactivas.
  return (
    <div
      data-free-layer
      className="absolute inset-0 pointer-events-none z-40 overflow-visible"
    >
      {sortedElements.map((el) => (
        <DraggableElement
          key={el.id}
          element={el}
          isDesigner={isDesigner}
          onUpdate={(updates) => onUpdateElement?.(el.id, updates)}
          onDelete={() => onDeleteElement?.(el.id)}
        />
      ))}
    </div>
  );
}
