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
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const [pos, setPos] = useState({
    x: element.x,
    y: element.y,
  });

  const [size, setSize] = useState({
    width: element.width || 200,
    height: 200,
  });

  const imageState = element as Partial<FreeElement> & {
    imageX?: number;
    imageY?: number;
  };

  // Posición de la imagen dentro del recorte
  const [imagePos, setImagePos] = useState({
    x: imageState.imageX ?? 0,
    y: imageState.imageY ?? 0,
  });

  const [isMovingImage, setIsMovingImage] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef({
    x: 0,
    y: 0,
  });

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

  useEffect(() => {
    if (!isDragging) {
      setPos({
        x: element.x,
        y: element.y,
      });
    }
  }, [element.x, element.y, isDragging]);

  useEffect(() => {
    if (!isResizing) {
      setSize({
        width: element.width || 200,
        height: 200,
      });
    }
  }, [element.width, isResizing]);

  /*
   * =========================
   * ARRASTRAR ELEMENTO
   * =========================
   */

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isDesigner || isResizing) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isDesigner) return;

    const parent =
      containerRef.current?.parentElement?.parentElement;

    if (!parent) return;

    const rect = parent.getBoundingClientRect();

    let newX =
      ((e.clientX - rect.left) / rect.width) * 100;

    let newY =
      ((e.clientY - rect.top) / rect.height) * 100;

    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    setPos({
      x: newX,
      y: newY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isDesigner) return;

    setIsDragging(false);

    const el = e.currentTarget as HTMLElement;

    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }

    onUpdate?.({
      x: pos.x,
      y: pos.y,
    } as Partial<FreeElement>);
  };

  /*
   * =========================
   * REDIMENSIONAR
   * =========================
   */

  const handleResizeStart = (
    e: React.PointerEvent,
    direction: ResizeDirection
  ) => {
    if (!isDesigner) return;

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

    const {
      mouseX,
      mouseY,
      width,
      height,
      direction,
    } = resizeStartRef.current;

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

    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);

    setSize({
      width: newWidth,
      height: newHeight,
    });
  };

  const handleResizeEnd = (e: React.PointerEvent) => {
    if (!isResizing) return;

    setIsResizing(false);

    const target = e.currentTarget as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    onUpdate?.({
      width: size.width,
      height: size.height,
    } as Partial<FreeElement>);
  };

  /*
   * =========================
   * MOVER IMAGEN DENTRO
   * DEL ÁREA DE RECORTE
   * =========================
   */

  const handleImagePointerDown = (
    e: React.PointerEvent
  ) => {
    if (!isDesigner || element.type !== "image") return;

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
  };

  const handleImagePointerMove = (
    e: React.PointerEvent
  ) => {
    if (!isMovingImage) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX =
      e.clientX - imageStartRef.current.mouseX;

    const deltaY =
      e.clientY - imageStartRef.current.mouseY;

    setImagePos({
      x: imageStartRef.current.imageX + deltaX,
      y: imageStartRef.current.imageY + deltaY,
    });
  };

  const handleImagePointerUp = (
    e: React.PointerEvent
  ) => {
    if (!isMovingImage) return;

    setIsMovingImage(false);

    const target = e.currentTarget as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    onUpdate?.({
      imageX: imagePos.x,
      imageY: imagePos.y,
    } as Partial<FreeElement>);
  };

  /*
   * =========================
   * ESTILO DE LOS CONTROLES
   * =========================
   */

  const handleClass =
    "absolute w-3 h-3 bg-white border-2 border-black rounded-full z-[100]";

  const fontFamily = (() => {
    const id = element.fontFamily;

    const displayMatch =
      FONT_DISPLAY_OPTIONS.find(
        (f) => f.id === id
      );

    if (displayMatch) {
      return displayMatch.cssVar;
    }

    const bodyMatch =
      FONT_BODY_OPTIONS.find(
        (f) => f.id === id
      );

    if (bodyMatch) {
      return bodyMatch.cssVar;
    }

    if (id === "body") {
      return "var(--font-work-sans)";
    }

    return "var(--font-fraunces)";
  })();

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute select-none ${
        isDesigner
          ? "cursor-move hover:ring-2 hover:ring-white/50"
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
        zIndex: 50,
        touchAction: isDesigner ? "none" : "auto",
        textShadow:
          element.type === "text"
            ? "0px 2px 4px rgba(0,0,0,0.3)"
            : "none",
      }}
    >
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
              isDesigner
                ? "cursor-grab active:cursor-grabbing"
                : ""
            }`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(1.3)`,
              touchAction: "none",
              userSelect: "none",
            }}
          />

          {isDesigner && (
            <>
              {/* ESQUINAS */}

              <div
                className={`${handleClass} -top-1.5 -left-1.5 cursor-nwse-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(e, "top-left")
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              <div
                className={`${handleClass} -top-1.5 -right-1.5 cursor-nesw-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(e, "top-right")
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              <div
                className={`${handleClass} -bottom-1.5 -right-1.5 cursor-nwse-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(
                    e,
                    "bottom-right"
                  )
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              <div
                className={`${handleClass} -bottom-1.5 -left-1.5 cursor-nesw-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(
                    e,
                    "bottom-left"
                  )
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              {/* LADOS */}

              <div
                className={`${handleClass} top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(e, "left")
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              <div
                className={`${handleClass} top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(e, "right")
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              <div
                className={`${handleClass} -top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(e, "top")
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />

              <div
                className={`${handleClass} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
                onPointerDown={(e) =>
                  handleResizeStart(e, "bottom")
                }
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
              />
            </>
          )}
        </div>
      ) : (
        element.content
      )}
    </div>
  );
}