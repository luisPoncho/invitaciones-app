"use client";

import { useState, useRef, useEffect } from "react";
import type { FreeElement } from "@/lib/mock-data";
import {
  FONT_DISPLAY_OPTIONS,
  FONT_BODY_OPTIONS,
} from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

interface DraggableElementProps {
  element: FreeElement;
  isDesigner: boolean;
  onUpdate?: (updates: Partial<FreeElement>) => void;
  onDelete?: () => void;
}

type ResizeDirection =
  | "top-left"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";

export default function DraggableElement({
  element,
  isDesigner,
  onUpdate,
  onDelete,
}: DraggableElementProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [editMode, setEditMode] = useState<"move" | "pan">("move");

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMovingImage, setIsMovingImage] = useState(false);

  const [pos, setPos] = useState({
    x: element.x,
    y: element.y,
  });

  const [size, setSize] = useState({
    width: element.width || 200,
    height: element.height || (element.type === "image" ? 200 : 100),
  });

  const [imagePos, setImagePos] = useState({
    x: element.imageX ?? 0,
    y: element.imageY ?? 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    direction: "" as ResizeDirection,
  });
  const imageStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    imageX: 0,
    imageY: 0,
  });

  // Sync external prop updates when not actively dragging/resizing
  useEffect(() => {
    if (!isDragging) {
      setPos({ x: element.x, y: element.y });
    }
  }, [element.x, element.y, isDragging]);

  useEffect(() => {
    if (!isResizing) {
      setSize({
        width: element.width || 200,
        height: element.height || (element.type === "image" ? 200 : 100),
      });
    }
  }, [element.width, element.height, isResizing, element.type]);

  useEffect(() => {
    if (!isMovingImage) {
      setImagePos({
        x: element.imageX ?? 0,
        y: element.imageY ?? 0,
      });
    }
  }, [element.imageX, element.imageY, isMovingImage]);

  // Click outside to deselect
  useEffect(() => {
    if (!isSelected || !isDesigner) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsSelected(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isSelected, isDesigner]);

  /*
   * =========================
   * SELECCIONAR Y ARRASTRAR POSICIÓN
   * =========================
   */
  const handleContainerPointerDown = (e: React.PointerEvent) => {
    if (!isDesigner || isResizing || isMovingImage) return;

    // Solo reaccionar a clic izquierdo
    if (e.button !== undefined && e.button !== 0) return;

    e.stopPropagation();

    // Marcar como seleccionado si no lo estaba
    if (!isSelected) {
      setIsSelected(true);
    }

    if (editMode === "move") {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
    }
  };

  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isDesigner) return;

    const parent = containerRef.current?.parentElement?.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100;
    let newY = ((e.clientY - rect.top) / rect.height) * 100;

    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    setPos({ x: newX, y: newY });
  };

  const handleContainerPointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isDesigner) return;

    setIsDragging(false);
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }

    onUpdate?.({ x: pos.x, y: pos.y });
  };

  /*
   * =========================
   * REDIMENSIONAR TAMAÑO LIBRE (WIDTH & HEIGHT)
   * =========================
   */
  const handleResizeStart = (
    e: React.PointerEvent,
    direction: ResizeDirection
  ) => {
    if (!isDesigner) return;
    if (e.button !== undefined && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: size.width,
      height: size.height,
      direction,
    };

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!isResizing) return;

    e.preventDefault();
    e.stopPropagation();

    const { mouseX, mouseY, width, height, direction } = resizeStartRef.current;
    const deltaX = e.clientX - mouseX;
    const deltaY = e.clientY - mouseY;

    let newWidth = width;
    let newHeight = height;

    if (direction.includes("right")) {
      newWidth = width + deltaX;
    }
    if (direction.includes("left")) {
      newWidth = width - deltaX;
    }
    if (direction.includes("bottom")) {
      newHeight = height + deltaY;
    }
    if (direction.includes("top")) {
      newHeight = height - deltaY;
    }

    newWidth = Math.max(30, newWidth);
    newHeight = Math.max(30, newHeight);

    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = (e: React.PointerEvent) => {
    if (!isResizing) return;

    setIsResizing(false);
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    onUpdate?.({ width: size.width, height: size.height });
  };

  /*
   * =========================
   * MOVER DISPOSICIÓN / ENCUADRE DE LA IMAGEN
   * =========================
   */
  const handleImagePointerDown = (e: React.PointerEvent) => {
    if (!isDesigner || element.type !== "image") return;
    if (e.button !== undefined && e.button !== 0) return;

    if (!isSelected) {
      setIsSelected(true);
      return;
    }

    if (editMode === "pan") {
      e.preventDefault();
      e.stopPropagation();

      setIsMovingImage(true);
      imageStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        imageX: imagePos.x,
        imageY: imagePos.y,
      };

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
    }
  };

  const handleImagePointerMove = (e: React.PointerEvent) => {
    if (!isMovingImage) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX = e.clientX - imageStartRef.current.mouseX;
    const deltaY = e.clientY - imageStartRef.current.mouseY;

    setImagePos({
      x: imageStartRef.current.imageX + deltaX,
      y: imageStartRef.current.imageY + deltaY,
    });
  };

  const handleImagePointerUp = (e: React.PointerEvent) => {
    if (!isMovingImage) return;

    setIsMovingImage(false);
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    onUpdate?.({ imageX: imagePos.x, imageY: imagePos.y });
  };

  const handleClass =
    "absolute w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full z-[100] shadow-md transition-transform hover:scale-125 cursor-pointer";

  const fontFamily = (() => {
    const id = element.fontFamily;
    const displayMatch = FONT_DISPLAY_OPTIONS.find((f) => f.id === id);
    if (displayMatch) return displayMatch.cssVar;
    const bodyMatch = FONT_BODY_OPTIONS.find((f) => f.id === id);
    if (bodyMatch) return bodyMatch.cssVar;
    if (id === "body") return "var(--font-work-sans)";
    return "var(--font-fraunces)";
  })();

  return (
    <div
      ref={containerRef}
      onPointerDown={handleContainerPointerDown}
      onPointerMove={handleContainerPointerMove}
      onPointerUp={handleContainerPointerUp}
      onPointerCancel={handleContainerPointerUp}
      className={`absolute select-none group ${
        isDesigner
          ? isSelected
            ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50"
            : "hover:ring-1 hover:ring-white/40 cursor-pointer"
          : ""
      }`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        color: element.color,
        fontSize: `${element.fontSize}px`,
        fontFamily,
        whiteSpace: "pre-wrap",
        textAlign: "center",
        zIndex: isSelected ? 60 : 50,
        touchAction: isDesigner ? "none" : "auto",
        textShadow:
          element.type === "text" ? "0px 2px 4px rgba(0,0,0,0.3)" : "none",
      }}
    >
      {/* Barra de herramientas flotante al seleccionar */}
      {isDesigner && isSelected && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/90 text-white border border-white/20 rounded-full px-2 py-1 shadow-2xl z-[110] whitespace-nowrap text-[10px] uppercase font-sans tracking-wider">
          {element.type === "image" && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMode("move");
                }}
                className={`px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                  editMode === "move"
                    ? "bg-amber-400 text-black font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
                title="Mover elemento por la pantalla"
              >
                🖐️ Mover
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMode("pan");
                }}
                className={`px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                  editMode === "pan"
                    ? "bg-amber-400 text-black font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
                title="Ajustar encuadre / disposición de la foto"
              >
                🖼️ Disposición
              </button>
            </>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-2 py-0.5 text-red-400 hover:text-red-300 transition-colors"
              title="Eliminar elemento"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Badge cuando el mouse pasa por encima antes de seleccionar */}
      {isDesigner && !isSelected && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white/80 text-[9px] px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
          Clic para editar
        </div>
      )}

      {element.type === "image" && element.url ? (
        <div
          className="relative overflow-hidden rounded-lg shadow-xl"
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
        >
          <img
            src={formatImageUrl(element.url)}
            alt=""
            draggable={false}
            onPointerDown={handleImagePointerDown}
            onPointerMove={handleImagePointerMove}
            onPointerUp={handleImagePointerUp}
            onPointerCancel={handleImagePointerUp}
            className={`absolute max-w-none ${
              isDesigner && isSelected && editMode === "pan"
                ? "cursor-grab active:cursor-grabbing"
                : isDesigner
                ? "cursor-move"
                : ""
            }`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(1.2)`,
              touchAction: "none",
              userSelect: "none",
            }}
          />

          {isDesigner && isSelected && (
            <>
              {/* ESQUINAS */}
              <div
                className={`${handleClass} -top-1.5 -left-1.5 cursor-nwse-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top-left")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -top-1.5 -right-1.5 cursor-nesw-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top-right")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -bottom-1.5 -right-1.5 cursor-nwse-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom-right")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -bottom-1.5 -left-1.5 cursor-nesw-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom-left")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              {/* LADOS */}
              <div
                className={`${handleClass} top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize`}
                onPointerDown={(e) => handleResizeStart(e, "left")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize`}
                onPointerDown={(e) => handleResizeStart(e, "right")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          {element.content}

          {isDesigner && isSelected && (
            <>
              {/* ESQUINAS PARA TEXTO */}
              <div
                className={`${handleClass} -top-1.5 -left-1.5 cursor-nwse-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top-left")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -top-1.5 -right-1.5 cursor-nesw-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top-right")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -bottom-1.5 -right-1.5 cursor-nwse-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom-right")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
              <div
                className={`${handleClass} -bottom-1.5 -left-1.5 cursor-nesw-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom-left")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}