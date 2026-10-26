"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Ancho de referencia del diseño (px). La invitación SIEMPRE se maqueta a
 * este ancho y luego se escala de forma uniforme al ancho real disponible.
 * Así el texto se parte en las mismas líneas, las secciones miden lo mismo
 * y los elementos libres caen exactamente en el mismo lugar en cualquier
 * dispositivo (celular, tablet o PC).
 */
export const DESIGN_WIDTH = 390;

/**
 * Alto de "pantalla" de referencia (px de diseño). Sustituye a 100vh/100svh
 * dentro de la invitación mediante la variable CSS --inv-vh, para que la
 * altura de la portada (y por lo tanto la posición vertical de todo lo que
 * hay debajo) no dependa del alto del navegador.
 */
export const DESIGN_VIEWPORT_HEIGHT = 720;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface DesignCanvasProps {
  children: React.ReactNode;
}

export default function DesignCanvas({ children }: DesignCanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsomorphicLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const measure = () => {
      const w = outer.clientWidth;
      if (w > 0) setScale(w / DESIGN_WIDTH);
    };

    measure();
    // Recalcular en rotación / cambio de tamaño de ventana o del marco del diseñador
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} data-design-canvas className="relative w-full">
      <div
        className="relative"
        style={
          {
            width: DESIGN_WIDTH,
            // `zoom` (a diferencia de transform: scale) también escala el
            // espacio que ocupa en el layout, así que el scroll y el alto
            // total quedan correctos sin compensaciones.
            zoom: scale,
            "--inv-vh": `${DESIGN_VIEWPORT_HEIGHT}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
