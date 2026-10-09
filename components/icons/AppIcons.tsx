"use client";

import React from "react";
import {
  MapPin,
  Map,
  Calendar,
  CalendarDays,
  Clock,
  Gift,
  MailCheck,
  CheckCircle2,
  Music,
  Disc,
  Volume2,
  VolumeX,
  Camera,
  Heart,
  Sparkles,
  Gem,
  Church,
  PartyPopper,
  Wine,
  Utensils,
  Bus,
  Shirt,
  ChevronLeft,
  ChevronRight,
  X,
  Navigation,
  ExternalLink,
  Share2,
  LucideProps,
} from "lucide-react";

/**
 * Catálogo de nombres de iconos soportados en la aplicación.
 * Puedes agregar nuevos nombres o mapear iconos personalizados aquí fácilmente.
 */
export type IconName =
  | "map-pin"
  | "map"
  | "navigation"
  | "calendar"
  | "calendar-days"
  | "clock"
  | "gift"
  | "rsvp"
  | "check"
  | "music"
  | "disc"
  | "volume-on"
  | "volume-off"
  | "camera"
  | "heart"
  | "sparkles"
  | "gem"
  | "ceremony"
  | "party"
  | "toast"
  | "dinner"
  | "transport"
  | "dress-code"
  | "chevron-left"
  | "chevron-right"
  | "close"
  | "external-link"
  | "share";

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  "map-pin": MapPin,
  map: Map,
  navigation: Navigation,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  clock: Clock,
  gift: Gift,
  rsvp: MailCheck,
  check: CheckCircle2,
  music: Music,
  disc: Disc,
  "volume-on": Volume2,
  "volume-off": VolumeX,
  camera: Camera,
  heart: Heart,
  sparkles: Sparkles,
  gem: Gem,
  ceremony: Church,
  party: PartyPopper,
  toast: Wine,
  dinner: Utensils,
  transport: Bus,
  "dress-code": Shirt,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  close: X,
  "external-link": ExternalLink,
  share: Share2,
};

export interface AppIconProps extends Omit<LucideProps, "ref"> {
  name: IconName | string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

/**
 * Helper para verificar si un string representa un espacio en blanco ("none", "blank", "ninguno", "").
 */
export function isBlankIcon(str?: string): boolean {
  if (!str) return true;
  const lower = str.trim().toLowerCase();
  return (
    lower === "none" ||
    lower === "blank" ||
    lower === "ninguno" ||
    lower === "ningun" ||
    lower === "vacio" ||
    lower === "sin-icono" ||
    lower === ""
  );
}

/**
 * Helper para verificar si un string es una URL de imagen (http/https/data-uri/path).
 */
export function isImageUrl(str?: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("/") ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)(\?.*)?$/i.test(trimmed)
  );
}

/**
 * AppIcon — Componente centralizado de iconos para la app de invitaciones.
 *
 * Soporta:
 * 1. Nombres de iconos Lucide: `<AppIcon name="map-pin" />`
 * 2. URLs de imágenes personalizadas: `<AppIcon name="https://misitio.com/icono.png" />`
 * 3. En blanco: `<AppIcon name="none" />` o `<AppIcon name="" />`
 */
export default function AppIcon({
  name,
  size = 20,
  color,
  strokeWidth = 1.8,
  className = "",
  ...rest
}: AppIconProps) {
  // 1. Si es espacio en blanco, no renderiza nada
  if (isBlankIcon(name)) {
    return null;
  }

  // 2. Si es una URL de imagen personalizada
  if (isImageUrl(name)) {
    const numericSize = typeof size === "number" ? `${size}px` : size;
    return (
      <img
        src={name}
        alt="Icono"
        style={{
          width: numericSize,
          height: numericSize,
          objectFit: "contain",
        }}
        className={`inline-block ${className}`}
      />
    );
  }

  // 3. Icono de la lista registrada
  const IconComponent = ICON_MAP[name as IconName];

  if (!IconComponent) {
    return (
      <Sparkles
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    />
  );
}

/**
 * Lista de iconos sugeridos organizada por categorías para el Diseñador
 */
export const ICON_CATEGORIES = [
  {
    category: "Opciones de Formato",
    icons: [
      { name: "none", label: "Sin Icono (Dejar en blanco)" },
      { name: "sparkles", label: "Destello por defecto" },
    ],
  },
  {
    category: "Ubicación y Tiempo",
    icons: [
      { name: "map-pin", label: "Pin de Ubicación" },
      { name: "map", label: "Mapa" },
      { name: "navigation", label: "Navegación / Cómo llegar" },
      { name: "calendar", label: "Calendario" },
      { name: "calendar-days", label: "Días de Calendario" },
      { name: "clock", label: "Reloj / Horario" },
    ],
  },
  {
    category: "Eventos e Itinerario",
    icons: [
      { name: "ceremony", label: "Ceremonia / Iglesia" },
      { name: "party", label: "Fiesta / Recepción" },
      { name: "toast", label: "Brindis" },
      { name: "dinner", label: "Cena / Banquete" },
      { name: "transport", label: "Transporte / Autobús" },
      { name: "dress-code", label: "Código de Vestimenta" },
    ],
  },
  {
    category: "Secciones y Detalles",
    icons: [
      { name: "gift", label: "Regalo / Mesa de Regalos" },
      { name: "rsvp", label: "RSVP / Confirmación" },
      { name: "camera", label: "Cámara / Fotos" },
      { name: "music", label: "Música" },
      { name: "heart", label: "Corazón" },
      { name: "sparkles", label: "Destellos / Adorno" },
      { name: "gem", label: "Gema / Joya" },
    ],
  },
];

/**
 * Renderiza un AppIcon (Lucide o Imagen por URL), emoji, o nada si es "none" / blanco.
 */
export function renderIconOrEmoji(
  iconStr?: string,
  props: Partial<AppIconProps> = {}
) {
  if (isBlankIcon(iconStr)) {
    return null;
  }

  if (isImageUrl(iconStr)) {
    return <AppIcon name={iconStr!} {...props} />;
  }

  if (iconStr! in ICON_MAP) {
    return <AppIcon name={iconStr as IconName} {...props} />;
  }

  return <span>{iconStr}</span>;
}


