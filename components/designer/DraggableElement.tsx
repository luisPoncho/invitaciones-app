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

export default function DraggableElement({
  element,
  isDesigner,
  onUpdate,
  onDelete,
}: DraggableElementProps) {
  const [isSelected, setIsSelected] = useState(false);

  // States
  const [pos, setPos] = useState({ x: element.x, y: element.y });
  const [size, setSize] = useState({
    width: element.width || 220,
    height: element.height || (element.type === "image" ? 220 : 100),
  });
  const [imagePos, setImagePos] = useState({
    x: element.imageX ?? 0,
    y: element.imageY ?? 0,
  });
  const [zoom, setZoom] = useState(element.zoom ?? 120);

  // Active interaction refs
  const activeActionRef = useRef<"drag" | "resize" | "pan" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef({ x: 0, y: 0 });
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

  // Sync with external updates when idle
  useEffect(() => {
    if (!activeActionRef.current) {
      setPos({ x: element.x, y: element.y });
      setSize({
        width: element.width || 220,
        height: element.height || (element.type === "image" ? 220 : 100),
      });
      setImagePos({
        x: element.imageX ?? 0,
        y: element.imageY ?? 0,
      });
      setZoom(element.zoom ?? 120);
    }
  }, [element.x, element.y, element.width, element.height, element.imageX, element.imageY, element.zoom, element.type]);

  // Click outside to deselect
  useEffect(() => {
    if (!isSelected || !isDesigner) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsSelected(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSelected(false);
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
      const layer = containerRef.current?.parentElement;
      if (!layer) return;

      const rect = layer.getBoundingClientRect();
      let newX = ((e.clientX - rect.left) / rect.width) * 100;
      let newY = ((e.clientY - rect.top) / rect.height) * 100;

      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      setPos({ x: newX, y: newY });
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

      newWidth = Math.max(30, newWidth);
      newHeight = Math.max(30, newHeight);

      setSize({ width: newWidth, height: newHeight });
    } else if (action === "pan") {
      const deltaX = e.clientX - panStartRef.current.mouseX;
      const deltaY = e.clientY - panStartRef.current.mouseY;

      setImagePos({
        x: panStartRef.current.imageX + deltaX,
        y: panStartRef.current.imageY + deltaY,
      });
    }
  }, []);

  const handleGlobalPointerUp = useCallback(() => {
    const action = activeActionRef.current;
    if (!action) return;

    activeActionRef.current = null;
    window.removeEventListener("pointermove", handleGlobalPointerMove);
    window.removeEventListener("pointerup", handleGlobalPointerUp);

    if (action === "drag") {
      onUpdate?.({ x: pos.x, y: pos.y });
    } else if (action === "resize") {
      onUpdate?.({ width: size.width, height: size.height });
    } else if (action === "pan") {
      onUpdate?.({ imageX: imagePos.x, imageY: imagePos.y });
    }
  }, [handleGlobalPointerMove, onUpdate, pos.x, pos.y, size.width, size.height, imagePos.x, imagePos.y]);

  const startAction = (action: "drag" | "resize" | "pan") => {
    activeActionRef.current = action;
    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: false });
    window.addEventListener("pointerup", handleGlobalPointerUp);
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
    dragStartRef.current = { x: e.clientX, y: e.clientY };
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
      width: size.width,
      height: size.height,
      direction,
    };
    startAction("resize");
  };

  /*
   * =========================
   * INICIAR ENCUADRE / DISPOSICIÓN IMAGEN (imageX, imageY)
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

    panStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      imageX: imagePos.x,
      imageY: imagePos.y,
    };
    startAction("pan");
  };

  const updateZoom = (newZoom: number) => {
    setZoom(newZoom);
    onUpdate?.({ zoom: newZoom });
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
            title="Arrastra para mover la posición en la pantalla"
          >
            🖐️ Mover
          </button>

          {element.type === "image" && (
            <div className="flex items-center gap-1 border-l border-r border-white/15 px-2">
              <span className="text-white/60 text-[9px]">Zoom:</span>
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
                  setImagePos({ x: 0, y: 0 });
                  updateZoom(120);
                  onUpdate?.({ imageX: 0, imageY: 0, zoom: 120 });
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

      {/* Indicador sobre la foto cuando está seleccionada */}
      {isDesigner && isSelected && element.type === "image" && (
        <div className="absolute top-2 left-2 z-[90] pointer-events-none bg-black/70 text-amber-300 text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm border border-amber-400/30">
          🖼️ Clic y arrastra sobre la foto para encuadrar
        </div>
      )}

      {/* Badge al pasar cursor encima si NO está seleccionado */}
      {isDesigner && !isSelected && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white/90 text-[9px] px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
          Clic para seleccionar / editar
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
                ? "cursor-grab active:cursor-grabbing hover:brightness-105"
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

              {/* LADOS */}
              <div
                className={`${handleClass} top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize`}
                onPointerDown={(e) => handleResizeStart(e, "left")}
              />
              <div
                className={`${handleClass} top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize`}
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
        <div className="relative">
          <div onPointerDown={handleDragElementStart} className={isDesigner ? "cursor-move" : ""}>
            {element.content}
          </div>

          {isDesigner && isSelected && (
            <>
              {/* ESQUINAS PARA TEXTO */}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}