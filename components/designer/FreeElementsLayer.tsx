"use client";

import type { FreeElement } from "@/lib/mock-data";
import DraggableElement from "./DraggableElement";

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

  return (
    <div
      data-free-layer
      className={`absolute inset-0 w-full h-full ${
        isDesigner ? "" : "pointer-events-none"
      } z-40 overflow-visible`}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, minHeight: "100%" }}
    >
      {elements.map((el) => (
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
