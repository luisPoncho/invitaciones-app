"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

/**
 * Gets the [data-free-layer] element (FreeElementsLayer container),
 * which is what x% and y% are relative to.
 */
function getFreeLayer(el: HTMLElement | null): HTMLElement | null {
  let current = el?.parentElement;
  while (current) {
    if (current.hasAttribute("data-free-layer")) return current;
    current = current.parentElement;
  }
  return null;
}

export default function DraggableElement({
  element,
  isDesigner,
  onUpdate,
  onDelete,
}: DraggableElementProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isPanningMode, setIsPanningMode] = useState(false);

  // States for visual updates
  const [pos, setPos] = useState({ x: element.x ?? 50, y: element.y ?? 50 });
  const [size, setSize] = useState({
    width: element.width || 220,
    height: element.height || (element.type === "image" ? 220 : 100),
  });
  const [imagePos, setImagePos] = useState({
    x: element.imageX ?? 0,
    y: element.imageY ?? 0,
  });
  const [zoom, setZoom] = useState(element.zoom ?? 120);

  // Synchronized refs to completely prevent stale closures
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const posRef = useRef({ x: element.x ?? 50, y: element.y ?? 50 });
  const sizeRef = useRef({
    width: element.width || 220,
    height: element.height || (element.type === "image" ? 220 : 100),
  });
  const imagePosRef = useRef({
    x: element.imageX ?? 0,
    y: element.imageY ?? 0,
  });
  const zoomRef = useRef(element.zoom ?? 120);

  // Active interaction refs
  const activeActionRef = useRef<"drag" | "resize" | "pan" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    posX: 0,
    posY: 0,
  });

  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    direction: "" as ResizeDirection,
  });

  const panStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    imageX: 0,
    imageY: 0,
  });

  // Sync with external updates when not actively dragging/interacting
  useEffect(() => {
    if (!activeActionRef.current) {
      const newPos = { x: element.x ?? 50, y: element.y ?? 50 };
      const newSize = {
        width: element.width || 220,
        height: element.height || (element.type === "image" ? 220 : 100),
      };
      const newImagePos = {
        x: element.imageX ?? 0,
        y: element.imageY ?? 0,
      };
      const newZoom = element.zoom ?? 120;

      posRef.current = newPos;
      sizeRef.current = newSize;
      imagePosRef.current = newImagePos;
      zoomRef.current = newZoom;

      setPos(newPos);
      setSize(newSize);
      setImagePos(newImagePos);
      setZoom(newZoom);
    }
  }, [
    element.x,
    element.y,
    element.width,
    element.height,
    element.imageX,
    element.imageY,
    element.zoom,
    element.type,
  ]);

  // Click outside to deselect
  useEffect(() => {
    if (!isSelected || !isDesigner) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsSelected(false);
        setIsPanningMode(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSelected(false);
        setIsPanningMode(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, isDesigner]);

  /*
   * =========================
   * GLOBAL POINTER LISTENERS FOR DRAGGING / PANNING / RESIZING
   * =========================
   */
  const handleGlobalPointerMove = useCallback((e: PointerEvent) => {
    const action = activeActionRef.current;
    if (!action) return;

    e.preventDefault();

    if (action === "drag") {
      const layer = getFreeLayer(containerRef.current);
      if (!layer) return;

      const rect = layer.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaXPercent = ((e.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartRef.current.mouseY) / rect.height) * 100;

      let nextX = dragStartRef.current.posX + deltaXPercent;
      let nextY = dragStartRef.current.posY + deltaYPercent;

      nextX = Math.max(0, Math.min(100, Math.round(nextX * 100) / 100));
      nextY = Math.max(0, Math.min(100, Math.round(nextY * 100) / 100));

      posRef.current = { x: nextX, y: nextY };
      setPos({ x: nextX, y: nextY });
    } else if (action === "resize") {
      const { mouseX, mouseY, width, height, direction } = resizeStartRef.current;
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      let newWidth = width;
      let newHeight = height;

      if (direction.includes("right")) newWidth = width + deltaX;
      if (direction.includes("left")) newWidth = width - deltaX;
      if (direction.includes("bottom")) newHeight = height + deltaY;
      if (direction.includes("top")) newHeight = height - deltaY;

      newWidth = Math.max(40, Math.round(newWidth));
      newHeight = Math.max(40, Math.round(newHeight));

      sizeRef.current = { width: newWidth, height: newHeight };
      setSize({ width: newWidth, height: newHeight });
    } else if (action === "pan") {
      const deltaX = e.clientX - panStartRef.current.mouseX;
      const deltaY = e.clientY - panStartRef.current.mouseY;

      const newImageX = Math.round(panStartRef.current.imageX + deltaX);
      const newImageY = Math.round(panStartRef.current.imageY + deltaY);

      imagePosRef.current = { x: newImageX, y: newImageY };
      setImagePos({ x: newImageX, y: newImageY });
    }
  }, []);

  const handleGlobalPointerUp = useCallback(() => {
    const action = activeActionRef.current;
    if (!action) return;

    activeActionRef.current = null;
    window.removeEventListener("pointermove", handleGlobalPointerMove);
    window.removeEventListener("pointerup", handleGlobalPointerUp);
    window.removeEventListener("pointercancel", handleGlobalPointerUp);

    if (action === "drag") {
      onUpdateRef.current?.({ x: posRef.current.x, y: posRef.current.y });
    } else if (action === "resize") {
      onUpdateRef.current?.({ width: sizeRef.current.width, height: sizeRef.current.height });
    } else if (action === "pan") {
      onUpdateRef.current?.({ imageX: imagePosRef.current.x, imageY: imagePosRef.current.y });
    }
  }, [handleGlobalPointerMove]);

  const startAction = (action: "drag" | "resize" | "pan") => {
    activeActionRef.current = action;
    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: false });
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
  };

  /*
   * =========================
   * INICIAR ARRASTRE ELEMENTO (x, y)
   * =========================
   */
  const handleDragElementStart = (e: React.PointerEvent) => {
    if (!isDesigner) return;
    if (e.button !== undefined && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    setIsSelected(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: posRef.current.x,
      posY: posRef.current.y,
    };
    startAction("drag");
  };

  /*
   * =========================
   * INICIAR REDIMENSIÓN (8 PUNTOS)
   * =========================
   */
  const handleResizeStart = (e: React.PointerEvent, direction: ResizeDirection) => {
    if (!isDesigner) return;
    if (e.button !== undefined && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    setIsSelected(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: sizeRef.current.width,
      height: sizeRef.current.height,
      direction,
    };
    startAction("resize");
  };

  /*
   * =========================
   * INICIAR ENCUADRE DE FOTO (imageX, imageY)
   * =========================
   */
  const handleImagePanStart = (e: React.PointerEvent) => {
    if (!isDesigner || element.type !== "image") return;
    if (e.button !== undefined && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    if (!isSelected) {
      setIsSelected(true);
      return;
    }

    if (isPanningMode) {
      panStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        imageX: imagePosRef.current.x,
        imageY: imagePosRef.current.y,
      };
      startAction("pan");
    } else {
      // Direct drag of element
      handleDragElementStart(e);
    }
  };

  const updateZoom = (newZoom: number) => {
    zoomRef.current = newZoom;
    setZoom(newZoom);
    onUpdateRef.current?.({ zoom: newZoom });
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
      onPointerDown={(e) => {
        if (!isDesigner) return;
        if (e.button !== undefined && e.button !== 0) return;
        if (!isSelected) {
          setIsSelected(true);
        }
      }}
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
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/95 text-white border border-white/20 rounded-full px-3 py-1 shadow-2xl z-[110] whitespace-nowrap text-[10px] uppercase font-sans tracking-wider">
          <button
            type="button"
            onPointerDown={handleDragElementStart}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 font-semibold cursor-move"
            title="Arrastra para mover la posición en la invitación"
          >
            🖐️ Mover
          </button>

          {element.type === "image" && (
            <div className="flex items-center gap-1 border-l border-r border-white/15 px-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPanningMode((prev) => !prev);
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] font-semibold transition-colors ${
                  isPanningMode
                    ? "bg-amber-400 text-black font-bold"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Activar modo para mover la foto dentro del marco"
              >
                {isPanningMode ? "✓ Encuadrando" : "🖼️ Encuadrar"}
              </button>

              <span className="text-white/60 text-[9px] ml-1">Zoom:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateZoom(Math.max(100, zoom - 15));
                }}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs"
              >
                -
              </button>
              <span className="text-[10px] text-amber-300 font-mono w-7 text-center">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateZoom(Math.min(300, zoom + 15));
                }}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs"
              >
                +
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  imagePosRef.current = { x: 0, y: 0 };
                  setImagePos({ x: 0, y: 0 });
                  updateZoom(120);
                  onUpdateRef.current?.({ imageX: 0, imageY: 0, zoom: 120 });
                }}
                className="ml-1 text-[9px] text-white/50 hover:text-white underline"
                title="Restablecer encuadre"
              >
                Centrar
              </button>
            </div>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-2 py-1 text-red-400 hover:text-red-300 transition-colors font-bold"
              title="Eliminar elemento"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Indicador sobre la foto cuando está en modo encuadre */}
      {isDesigner && isSelected && element.type === "image" && isPanningMode && (
        <div className="absolute top-2 left-2 z-[90] pointer-events-none bg-black/80 text-amber-300 text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm border border-amber-400/40">
          🖼️ Arrastra sobre la imagen para encuadrar
        </div>
      )}

      {/* Badge al pasar cursor encima si NO está seleccionado */}
      {isDesigner && !isSelected && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white/90 text-[9px] px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
          Clic para mover o editar
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
            onPointerDown={handleImagePanStart}
            className={`absolute max-w-none transition-transform duration-75 ${
              isDesigner && isSelected
                ? isPanningMode
                  ? "cursor-grab active:cursor-grabbing hover:brightness-105"
                  : "cursor-move hover:brightness-105"
                : isDesigner
                ? "cursor-pointer"
                : ""
            }`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(${zoom / 100})`,
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
              />
              <div
                className={`${handleClass} -top-1.5 -right-1.5 cursor-nesw-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top-right")}
              />
              <div
                className={`${handleClass} -bottom-1.5 -right-1.5 cursor-nwse-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom-right")}
              />
              <div
                className={`${handleClass} -bottom-1.5 -left-1.5 cursor-nesw-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom-left")}
              />

              {/* BORDES LATERALES */}
              <div
                className={`${handleClass} top-1/2 -translate-y-1/2 -left-1.5 cursor-ew-resize`}
                onPointerDown={(e) => handleResizeStart(e, "left")}
              />
              <div
                className={`${handleClass} top-1/2 -translate-y-1/2 -right-1.5 cursor-ew-resize`}
                onPointerDown={(e) => handleResizeStart(e, "right")}
              />
              <div
                className={`${handleClass} -top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
                onPointerDown={(e) => handleResizeStart(e, "top")}
              />
              <div
                className={`${handleClass} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
                onPointerDown={(e) => handleResizeStart(e, "bottom")}
              />
            </>
          )}
        </div>
      ) : (
        /* Elemento de Texto */
        <div
          onPointerDown={handleDragElementStart}
          className={`cursor-move relative px-2 py-1 ${
            isDesigner && isSelected
              ? "bg-black/20 rounded border border-amber-400/40"
              : ""
          }`}
        >
          {element.content || "Texto"}
        </div>
      )}
    </div>
  );
}