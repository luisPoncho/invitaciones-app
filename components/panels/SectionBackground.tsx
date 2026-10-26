"use client";

import { useEffect, useRef } from "react";
import type { PhotoScrollBehavior } from "@/lib/mock-data";

/**
 * Fondo de sección con efectos "fija" (parallax fijo) y "movimiento"
 * (parallax suave) calculados con JS en lugar de `background-attachment: fixed`.
 *
 * `background-attachment: fixed` mide la imagen respecto a la ventana completa
 * del navegador: en la vista previa del diseñador (marco de 390px dentro de una
 * ventana de PC) la imagen salía enorme/recortada, no funciona en iOS y además
 * choca con el `zoom` del DesignCanvas. Aquí el efecto se calcula respecto al
 * contenedor que realmente hace scroll (el marco en el diseñador, la ventana en
 * la invitación pública), así que se ve igual en ambos.
 *
 * Se coloca como primer hijo de una <section className="relative ...">.
 */

/** Qué tanto se desplaza el fondo en "movimiento" respecto al contenido (0 = fijo a la sección). */
const PARALLAX_SPEED = 0.25;

interface SectionBackgroundProps {
  url?: string;
  behavior?: PhotoScrollBehavior;
  positionX?: number;
  positionY?: number;
  zoom?: number;
  /** Posición CSS libre (ej. "center top"); tiene prioridad sobre positionX/positionY */
  position?: string;
}

/** Busca el ancestro que realmente hace scroll; si no hay, se usa la ventana. */
function findScrollParent(el: HTMLElement): HTMLElement | null {
  let current = el.parentElement;
  while (current && current !== document.body) {
    const { overflowY } = getComputedStyle(current);
    if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export default function SectionBackground({
  url,
  behavior = "normal",
  positionX,
  positionY,
  zoom,
  position,
}: SectionBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const isParallax = behavior === "fija" || behavior === "movimiento";

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const layer = layerRef.current;
    if (!url || !isParallax || !wrapper || !layer) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion && behavior === "movimiento") return;

    let scrollParent = findScrollParent(wrapper);
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = wrapper.getBoundingClientRect();
      // px de pantalla por px de diseño (el DesignCanvas escala con `zoom`)
      const scale = wrapper.offsetWidth > 0 ? rect.width / wrapper.offsetWidth : 1;
      if (scale <= 0) return;

      const view = scrollParent
        ? scrollParent.getBoundingClientRect()
        : { top: 0, height: window.innerHeight };

      const sectionH = rect.height / scale;
      const viewH = view.height / scale;

      if (behavior === "fija") {
        // La capa mide exactamente lo visible y se mantiene pegada a la "pantalla":
        // la sección actúa como ventana que deja ver la imagen quieta.
        const offset = (view.top - rect.top) / scale;
        layer.style.top = "0px";
        layer.style.height = `${viewH}px`;
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      } else {
        // Movimiento suave: la imagen se desplaza más lento que el contenido.
        const maxOffset = ((viewH + sectionH) / 2) * PARALLAX_SPEED;
        const centerDelta = (view.top + view.height / 2 - (rect.top + rect.height / 2)) / scale;
        const offset = Math.max(-maxOffset, Math.min(maxOffset, centerDelta * PARALLAX_SPEED));
        layer.style.top = `${-maxOffset}px`;
        layer.style.height = `${sectionH + maxOffset * 2}px`;
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const handleResize = () => {
      scrollParent = findScrollParent(wrapper);
      schedule();
    };

    update();
    // `scroll` no burbujea: en captura recibimos el de la ventana y el de cualquier contenedor
    document.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(handleResize);
    ro.observe(wrapper);
    if (scrollParent) ro.observe(scrollParent);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [url, behavior, isParallax]);

  if (!url) return null;

  const bgPosition = position || `${positionX ?? 50}% ${positionY ?? 50}%`;
  const zoomScale = zoom && zoom > 100 ? zoom / 100 : 1;

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <div
        ref={layerRef}
        className="absolute left-0 w-full will-change-transform"
        style={{ top: 0, height: "100%" }}
      >
        {/* El zoom va en una capa interna para no mezclarse con el translate del parallax */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundPosition: bgPosition,
            backgroundRepeat: "no-repeat",
            transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
            transformOrigin: bgPosition,
          }}
        />
      </div>
    </div>
  );
}
