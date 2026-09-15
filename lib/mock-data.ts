// Tipos base del evento
export type EventData = {
  slug: string;
  anfitriones: string;
  fechaISO: string;
  fechaLegible: string;
  lugarNombre: string;
  lugarDireccion: string;
  lugarDireccionUrl?: string;
  // Itinerario: Boda Religiosa & Recepción
  ceremoniaHora?: string;
  ceremoniaLugar?: string;
  ceremoniaDireccion?: string;
  ceremoniaUrl?: string;
  recepcionHora?: string;
  recepcionLugar?: string;
  recepcionDireccion?: string;
  recepcionUrl?: string;
  mensaje: string;
  fotos: string[];
};

// Paleta de colores personalizable de la invitación
export type InvitationTheme = {
  primary: string;     // Fondo principal (Portada, RSVP)
  secondary: string;   // Fondo secundario (FechaLugar, Galería)
  paper: string;       // Color claro / texto sobre fondos oscuros
  accent: string;      // Acento (dorado oscuro)
  accentLight: string; // Acento claro (dorado suave)
  fontDisplay?: string; // ID de fuente para títulos (ej. "fraunces")
  fontBody?: string;    // ID de fuente para cuerpo (ej. "work-sans")
};

export type EntryAnimation = "carta" | "disco" | "vinilo" | "none";
export type StylePreset = "clasico" | "romantico";
export type PhotoScrollBehavior = "fija" | "movimiento" | "normal";
export type PhotoDisplayMode = "fondo" | "cuadro" | "galeria";

export type PhotoConfig = {
  url: string;
  scrollBehavior: PhotoScrollBehavior;
  displayMode: PhotoDisplayMode;
  frameSize?: "small" | "medium" | "large";
  framePosition?: "left" | "center" | "right";
  objectPosition?: string; // e.g., "center center", "top center"
};

export type FreeElement = {
  id: string;
  type: "text" | "image";
  name?: string; // Título organizativo para el diseñador
  content?: string;
  url?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color?: string;
  fontSize?: number; // px
  fontFamily?: string; // font ID (ej. "fraunces", "work-sans")
  width?: number; // px for image width
  height?: number; // px for image height
  imageX?: number; // px offset horizontal para encuadre
  imageY?: number; // px offset vertical para encuadre
  zoom?: number; // zoom percentage (e.g. 100 - 300)
};

export type SectionBackgrounds = {
  portada?: string;
  portadaScrollBehavior?: PhotoScrollBehavior;
  fechaLugar?: string;
  fechaLugarScrollBehavior?: PhotoScrollBehavior;
  rsvp?: string;
  rsvpScrollBehavior?: PhotoScrollBehavior;
};

// Opciones de tipografías (Google Fonts, licencia OFL / uso libre)
export const FONT_DISPLAY_OPTIONS = [
  { id: "fraunces",    label: "Fraunces",           cssVar: "var(--font-fraunces)" },
  { id: "cormorant",   label: "Cormorant Garamond",  cssVar: "var(--font-cormorant)" },
  { id: "playfair",    label: "Playfair Display",    cssVar: "var(--font-playfair)" },
  { id: "great-vibes", label: "Great Vibes",         cssVar: "var(--font-great-vibes)" },
  { id: "cinzel",      label: "Cinzel",              cssVar: "var(--font-cinzel)" },
  { id: "dm-serif",    label: "DM Serif Display",    cssVar: "var(--font-dm-serif)" },
] as const;

export const FONT_BODY_OPTIONS = [
  { id: "work-sans", label: "Work Sans",   cssVar: "var(--font-work-sans)" },
  { id: "lato",      label: "Lato",        cssVar: "var(--font-lato)" },
  { id: "nunito",    label: "Nunito",      cssVar: "var(--font-nunito)" },
  { id: "josefin",   label: "Josefin Sans", cssVar: "var(--font-josefin)" },
] as const;

export type FontDisplayId = typeof FONT_DISPLAY_OPTIONS[number]["id"];
export type FontBodyId = typeof FONT_BODY_OPTIONS[number]["id"];

/** Devuelve la CSS var de una fuente display por su ID */
export function getFontDisplayVar(id?: string): string {
  return FONT_DISPLAY_OPTIONS.find(f => f.id === id)?.cssVar ?? "var(--font-fraunces)";
}

/** Devuelve la CSS var de una fuente body por su ID */
export function getFontBodyVar(id?: string): string {
  return FONT_BODY_OPTIONS.find(f => f.id === id)?.cssVar ?? "var(--font-work-sans)";
}

export type ItineraryItem = {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
};

export const DEFAULT_ITINERARY_ITEMS: ItineraryItem[] = [
  { id: "1", time: "4:00 PM", title: "Ceremonia Religiosa", description: "Parroquia de San José", icon: "⛪" },
  { id: "2", time: "6:00 PM", title: "Cóctel de Bienvenida", description: "Jardín Central", icon: "🥂" },
  { id: "3", time: "7:30 PM", title: "Banquete & Brindis", description: "Salón Principal", icon: "🍽️" },
  { id: "4", time: "9:00 PM", title: "Vals de los Novios", description: "Pista de Baile", icon: "💃" },
  { id: "5", time: "10:00 PM", title: "Fiesta & Música", description: "Celebración con DJ", icon: "🎵" },
];

export type SectionBlockType = 
  | "portada"
  | "cuenta-regresiva"
  | "fecha-lugar"
  | "itinerario"
  | "galeria"
  | "rsvp"
  | "foto-fondo"
  | "mesa-regalos"
  | "separador"
  | "texto-libre";

export type SectionBlock = {
  id: string;
  type: SectionBlockType;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
  giftRegistryUrl?: string;
  giftRegistryTitle?: string;
  customTitle?: string;
  customBody?: string;
  photoUrl?: string;
  itineraryTitle?: string;
  itinerarySubtitle?: string;
  itineraryItems?: ItineraryItem[];
};

// Config completa: datos + tema + metadatos
export type FullInvitationConfig = EventData & {
  theme: InvitationTheme;
  adminToken: string; // Token único para que los anfitriones accedan al panel
  createdAt: string;
  updatedAt: string;
  entryAnimation: EntryAnimation;
  stylePreset: StylePreset;
  photoConfigs: PhotoConfig[];
  freeElements: FreeElement[];
  sectionBackgrounds?: SectionBackgrounds; // DEPRECATED: Se mantiene por compatibilidad hacia atrás, migrar a sections
  sections?: SectionBlock[];
  itinerary?: ItineraryItem[];
  musicUrl?: string; // Spotify track URL for background music
};

// Respuesta de un invitado al RSVP
export type RSVPEntry = {
  nombre: string;
  asistencia: "si" | "no";
  pases?: number;
  timestamp: string;
};

// Tema por defecto (verde botánico original)
export const defaultTheme: InvitationTheme = {
  primary: "#22342A",
  secondary: "#182620",
  paper: "#F4EFE4",
  accent: "#B08D3F",
  accentLight: "#D9C48B",
  fontDisplay: "fraunces",
  fontBody: "work-sans",
};

export const STYLE_PRESETS: {
  id: StylePreset;
  name: string;
  desc: string;
  description: string;
  theme: InvitationTheme;
  preview: { bg: string; text: string; accent: string };
}[] = [
  {
    id: "clasico",
    name: "Clásico Elegante",
    desc: "Fondos oscuros, tipografía serif, minimalista y sofisticado",
    description: "Fondos oscuros, tipografía serif, minimalista y sofisticado",
    theme: {
      primary: "#22342A",
      secondary: "#182620",
      paper: "#F4EFE4",
      accent: "#B08D3F",
      accentLight: "#D9C48B",
      fontDisplay: "fraunces",
      fontBody: "work-sans",
    },
    preview: { bg: "#22342A", text: "#F4EFE4", accent: "#B08D3F" },
  },
  {
    id: "romantico",
    name: "Romántico Floral",
    desc: "Fondos claros, ornamentos florales, tipografía script, luminoso",
    description: "Fondos claros, ornamentos florales, tipografía script, diseño inspirado en Canva",
    theme: {
      primary: "#4A3728",
      secondary: "#3D2E22",
      paper: "#FFF9F0",
      accent: "#C4897D",
      accentLight: "#E8C4B8",
      fontDisplay: "great-vibes",
      fontBody: "josefin",
    },
    preview: { bg: "#FFF9F0", text: "#4A3728", accent: "#C4897D" },
  },
];


// Datos de ejemplo para pruebas sin Supabase
export const mockEvent: EventData = {
  slug: "sofia-y-mateo",
  anfitriones: "Sofía & Mateo",
  fechaISO: "2026-11-14T18:00:00",
  fechaLegible: "14 de noviembre, 2026",
  lugarNombre: "Hacienda Los Encinos",
  lugarDireccion: "Camino a San Isidro 450, Tepatitlán de Morelos, Jal.",
  ceremoniaHora: "4:00 PM",
  ceremoniaLugar: "Parroquia de San José",
  ceremoniaDireccion: "Av. Hidalgo #123, Centro Histórico",
  ceremoniaUrl: "https://maps.google.com/?q=Parroquia+San+Jose",
  recepcionHora: "7:00 PM",
  recepcionLugar: "Hacienda Los Encinos",
  recepcionDireccion: "Camino a San Isidro 450, Tepatitlán de Morelos, Jal.",
  recepcionUrl: "https://maps.google.com/?q=Hacienda+Los+Encinos",
  mensaje:
    "Con el corazón lleno de alegría, queremos que nos acompañes a celebrar el inicio de esta nueva etapa.",
  fotos: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800",
  ],
};
