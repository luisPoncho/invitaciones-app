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
 * AppIcon — Componente centralizado de iconos para la app de invitaciones.
 *
 * Uso sencillo:
 * `<AppIcon name="map-pin" size={20} color="#B08D3F" />`
 * `<AppIcon name="ceremony" size={24} />`
 *
 * Para personalizar un icono en todo el proyecto, solo cambia la referencia en `ICON_MAP` arriba.
 */
export default function AppIcon({
  name,
  size = 20,
  color,
  strokeWidth = 1.8,
  className = "",
  ...rest
}: AppIconProps) {
  const IconComponent = ICON_MAP[name as IconName];

  if (!IconComponent) {
    // Fallback genérico si el nombre no existe
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
 * Renderiza un AppIcon si iconStr es un nombre de icono registrado ("ceremony", "party", "map-pin", etc.),
 * o renderiza el texto/emoji si es un emoji ("💒", "🥂", "💍").
 */
export function renderIconOrEmoji(
  iconStr?: string,
  props: Partial<AppIconProps> = {}
) {
  if (!iconStr) return <AppIcon name="sparkles" {...props} />;
  if (iconStr in ICON_MAP) {
    return <AppIcon name={iconStr as IconName} {...props} />;
  }
  return <span>{iconStr}</span>;
}


