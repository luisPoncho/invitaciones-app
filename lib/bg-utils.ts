/**
 * Utilidad para calcular propiedades de fondo de sección.
 * 
 * Centraliza la lógica de background-attachment, background-size
 * y background-position que se repite en todos los paneles.
 * 
 * IMPORTANTE: background-attachment: fixed NO funciona en iOS Safari
 * dentro de contenedores con overflow (que es nuestro caso).
 * Detectamos iOS en el cliente y hacemos fallback a scroll.
 */

import type { PhotoScrollBehavior } from "./mock-data";

/**
 * Detecta si el navegador es iOS (Safari, Chrome iOS, etc.)
 * donde background-attachment: fixed no funciona dentro de
 * contenedores con overflow.
 */
function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

let _isIOSCached: boolean | null = null;
function getIsIOS(): boolean {
  if (_isIOSCached === null) {
    _isIOSCached = isIOS();
  }
  return _isIOSCached;
}

export interface SectionBgStyles {
  backgroundImage?: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundAttachment: string;
  backgroundRepeat: string;
}

/**
 * Calcula los estilos de fondo para una sección dada su configuración.
 * 
 * @param bgUrl - URL de la imagen de fondo (ya formateada)
 * @param bgScrollBehavior - Comportamiento del scroll ("fija" | "movimiento" | "normal")
 * @param bgPositionX - Posición X en porcentaje (0-100)
 * @param bgPositionY - Posición Y en porcentaje (0-100)
 * @param bgZoom - Zoom en porcentaje (100+)
 * @returns Objeto con los estilos CSS de fondo
 */
export function getSectionBgStyles(
  bgUrl?: string,
  bgScrollBehavior?: PhotoScrollBehavior,
  bgPositionX?: number,
  bgPositionY?: number,
  bgZoom?: number,
): SectionBgStyles | null {
  if (!bgUrl) return null;

  // En iOS, background-attachment: fixed no funciona en contenedores con overflow
  const ios = getIsIOS();

  let bgAttachment: string;
  if (bgScrollBehavior === "fija" || bgScrollBehavior === "movimiento") {
    bgAttachment = ios ? "scroll" : "fixed";
  } else {
    bgAttachment = "scroll";
  }

  let bgSize: string;
  if (bgZoom && bgZoom > 100) {
    bgSize = `${bgZoom}% auto`;
  } else if (bgScrollBehavior === "movimiento") {
    bgSize = ios ? "cover" : "120%";
  } else {
    bgSize = "cover";
  }

  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  return {
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: bgSize,
    backgroundPosition: bgPosition,
    backgroundAttachment: bgAttachment,
    backgroundRepeat: "no-repeat",
  };
}
