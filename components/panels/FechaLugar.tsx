import type { EventData, InvitationTheme, PhotoScrollBehavior, StylePreset } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import { LeafDivider } from "./Ornaments";

interface FechaLugarProps {
  event: EventData;
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

function getMapsUrl(url?: string, lugar?: string, direccion?: string): string {
  if (url && /^https?:\/\//i.test(url.trim())) {
    return url.trim();
  }
  const query = [lugar, direccion].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "Ubicacion")}`;
}

export default function FechaLugar({
  event,
  theme,
  stylePreset = "clasico",
  bgUrl,
  bgScrollBehavior,
  bgPositionX,
  bgPositionY,
  bgZoom,
}: FechaLugarProps) {
  const t = { ...defaultTheme, ...theme };
  const fontDisplay = getFontDisplayVar(t.fontDisplay);
  const fontBody = getFontBodyVar(t.fontBody);
  const formattedBgUrl = formatImageUrl(bgUrl);
  const isRomantico = stylePreset === "romantico";

  const bgAttachment =
    bgScrollBehavior === "fija" ? "fixed" :
    bgScrollBehavior === "movimiento" ? "fixed" :
    "scroll";
  const bgSize = bgZoom && bgZoom > 100 ? `${bgZoom}% auto` : bgScrollBehavior === "movimiento" ? "120%" : "cover";
  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  const ceremoniaLugar = event.ceremoniaLugar || event.lugarNombre || "Parroquia de San José";
  const ceremoniaDireccion = event.ceremoniaDireccion || event.lugarDireccion || "Centro Histórico";
  const ceremoniaHora = event.ceremoniaHora || "4:00 PM";
  const ceremoniaMapsUrl = getMapsUrl(event.ceremoniaUrl, ceremoniaLugar, ceremoniaDireccion);

  const recepcionLugar = event.recepcionLugar || event.lugarNombre || "Hacienda Los Encinos";
  const recepcionDireccion = event.recepcionDireccion || event.lugarDireccion || "Camino a San Isidro 450";
  const recepcionHora = event.recepcionHora || "7:00 PM";
  const recepcionMapsUrl = getMapsUrl(event.recepcionUrl, recepcionLugar, recepcionDireccion);

  if (isRomantico) {
    return (
      <section
        style={{
          backgroundColor: t.paper || "#FAF6EE",
          color: t.primary,
          ...(formattedBgUrl ? {
            backgroundImage: `url(${formattedBgUrl})`,
            backgroundSize: bgSize,
            backgroundPosition: bgPosition,
            backgroundAttachment: bgAttachment,
          } : {}),
        }}
        className="relative text-center py-20 px-6 overflow-hidden"
      >
        {formattedBgUrl && <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-0" />}
        <div className="relative z-10 max-w-lg mx-auto">
          <p
            style={{ color: t.accent, fontFamily: fontBody }}
            className="text-xs uppercase tracking-[0.25em] mb-2 font-medium"
          >
            Ubicación
          </p>

          <h2 style={{ fontFamily: fontDisplay, color: t.primary }} className="italic text-4xl mb-2 font-normal">
            Dónde & Cuándo
          </h2>

          <div className="my-3">
            <LeafDivider color={t.accent} />
          </div>

          {event.fechaLegible && (
            <div
              style={{
                borderColor: `${t.accent}40`,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
              className="inline-block mb-10 border rounded-full px-6 py-2 shadow-xs"
            >
              <span style={{ color: t.accent, fontFamily: fontBody }} className="text-xs font-medium tracking-wider">
                🗓️ {event.fechaLegible}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            {/* Card 1: Boda Religiosa */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderColor: `${t.accent}30`,
              }}
              className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 relative"
            >
              <div>
                <div
                  style={{ backgroundColor: `${t.accent}15`, borderColor: `${t.accent}30` }}
                  className="w-14 h-14 mx-auto rounded-full border flex items-center justify-center text-2xl mb-3"
                >
                  ⛪
                </div>
                <span
                  style={{ color: t.accent, borderColor: `${t.accent}40`, fontFamily: fontBody }}
                  className="inline-block text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 bg-white"
                >
                  {ceremoniaHora}
                </span>
                <h3
                  style={{ fontFamily: fontDisplay, color: t.primary }}
                  className="text-2xl italic font-normal mb-2"
                >
                  Ceremonia Religiosa
                </h3>
                <p style={{ fontFamily: fontBody, color: t.primary }} className="text-sm font-semibold mb-1">
                  {ceremoniaLugar}
                </p>
                <p
                  style={{ color: `${t.primary}99`, fontFamily: fontBody }}
                  className="text-xs leading-relaxed mb-6"
                >
                  {ceremoniaDireccion}
                </p>
              </div>

              <a
                href={ceremoniaMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: t.accent,
                  color: "#FFFFFF",
                  fontFamily: fontBody,
                }}
                className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest rounded-2xl py-3 px-4 hover:opacity-90 transition-all text-center shadow-md font-medium"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Ver Ubicación
              </a>
            </div>

            {/* Card 2: Recepción */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderColor: `${t.accent}30`,
              }}
              className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 relative"
            >
              <div>
                <div
                  style={{ backgroundColor: `${t.accent}15`, borderColor: `${t.accent}30` }}
                  className="w-14 h-14 mx-auto rounded-full border flex items-center justify-center text-2xl mb-3"
                >
                  🥂
                </div>
                <span
                  style={{ color: t.accent, borderColor: `${t.accent}40`, fontFamily: fontBody }}
                  className="inline-block text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 bg-white"
                >
                  {recepcionHora}
                </span>
                <h3
                  style={{ fontFamily: fontDisplay, color: t.primary }}
                  className="text-2xl italic font-normal mb-2"
                >
                  Recepción & Fiesta
                </h3>
                <p style={{ fontFamily: fontBody, color: t.primary }} className="text-sm font-semibold mb-1">
                  {recepcionLugar}
                </p>
                <p
                  style={{ color: `${t.primary}99`, fontFamily: fontBody }}
                  className="text-xs leading-relaxed mb-6"
                >
                  {recepcionDireccion}
                </p>
              </div>

              <a
                href={recepcionMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: t.accent,
                  color: "#FFFFFF",
                  fontFamily: fontBody,
                }}
                className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest rounded-2xl py-3 px-4 hover:opacity-90 transition-all text-center shadow-md font-medium"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Ver Ubicación
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        backgroundColor: t.secondary,
        color: t.paper,
        ...(formattedBgUrl ? {
          backgroundImage: `url(${formattedBgUrl})`,
          backgroundSize: bgSize,
          backgroundPosition: bgPosition,
          backgroundAttachment: bgAttachment,
        } : {}),
      }}
      className="relative text-center py-20 px-6 overflow-hidden"
    >
      {formattedBgUrl && <div className="absolute inset-0 bg-black/55 z-0" />}
      <div className="relative z-10 max-w-lg mx-auto">
        <p
          style={{ color: t.accentLight, fontFamily: fontBody }}
          className="text-xs uppercase tracking-[0.25em] mb-2 font-medium"
        >
          Ubicación
        </p>

        <h2 style={{ fontFamily: fontDisplay }} className="italic text-4xl mb-4">
          Dónde & Cuándo
        </h2>

        {event.fechaLegible && (
          <div className="inline-block mb-10 border border-white/20 rounded-full px-5 py-1.5 bg-black/20 backdrop-blur-sm">
            <span style={{ color: t.accentLight, fontFamily: fontBody }} className="text-xs tracking-wider">
              🗓️ {event.fechaLegible}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {/* Card 1: Boda Religiosa */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.07)",
              borderColor: `${t.accentLight}33`,
            }}
            className="p-6 rounded-2xl border backdrop-blur-md flex flex-col justify-between transition-transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">⛪</span>
                <span
                  style={{ color: t.accentLight, fontFamily: fontBody }}
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10"
                >
                  {ceremoniaHora}
                </span>
              </div>
              <h3
                style={{ fontFamily: fontDisplay }}
                className="text-xl italic font-semibold mb-2"
              >
                Ceremonia Religiosa
              </h3>
              <p style={{ fontFamily: fontBody }} className="text-sm font-medium mb-1">
                {ceremoniaLugar}
              </p>
              <p
                style={{ color: `${t.paper}b3`, fontFamily: fontBody }}
                className="text-xs leading-relaxed mb-6"
              >
                {ceremoniaDireccion}
              </p>
            </div>

            <a
              href={ceremoniaMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: t.accent,
                color: t.paper,
                fontFamily: fontBody,
              }}
              className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest rounded-xl py-3 px-4 hover:opacity-90 transition-all text-center shadow-lg font-medium"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Ubicación Misa
            </a>
          </div>

          {/* Card 2: Recepción */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.07)",
              borderColor: `${t.accentLight}33`,
            }}
            className="p-6 rounded-2xl border backdrop-blur-md flex flex-col justify-between transition-transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🥂</span>
                <span
                  style={{ color: t.accentLight, fontFamily: fontBody }}
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10"
                >
                  {recepcionHora}
                </span>
              </div>
              <h3
                style={{ fontFamily: fontDisplay }}
                className="text-xl italic font-semibold mb-2"
              >
                Recepción & Fiesta
              </h3>
              <p style={{ fontFamily: fontBody }} className="text-sm font-medium mb-1">
                {recepcionLugar}
              </p>
              <p
                style={{ color: `${t.paper}b3`, fontFamily: fontBody }}
                className="text-xs leading-relaxed mb-6"
              >
                {recepcionDireccion}
              </p>
            </div>

            <a
              href={recepcionMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: t.accent,
                color: t.paper,
                fontFamily: fontBody,
              }}
              className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest rounded-xl py-3 px-4 hover:opacity-90 transition-all text-center shadow-lg font-medium"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Ubicación Recepción
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
