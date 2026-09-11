import type { EventData, InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

interface FechaLugarProps {
  event: EventData;
  theme?: InvitationTheme;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function FechaLugar({ event, theme, bgUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: FechaLugarProps) {
  const t = { ...defaultTheme, ...theme };
  const fontDisplay = getFontDisplayVar(t.fontDisplay);
  const fontBody = getFontBodyVar(t.fontBody);
  const formattedBgUrl = formatImageUrl(bgUrl);

  const bgAttachment =
    bgScrollBehavior === "fija" ? "fixed" :
    bgScrollBehavior === "movimiento" ? "fixed" :
    "scroll";
  const bgSize = bgZoom && bgZoom > 100 ? `${bgZoom}% auto` : bgScrollBehavior === "movimiento" ? "120%" : "cover";
  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  const lugarDireccionUrl = event.lugarDireccionUrl ?? "";
  const mapsUrl = /^https?:\/\//i.test(lugarDireccionUrl)
    ? lugarDireccionUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        lugarDireccionUrl
      )}`;

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
      className="relative text-center"
    >
      {bgUrl && <div className="absolute inset-0 bg-black/50 z-0" />}
      <div className="relative z-10 py-20 px-6">
      <h2 style={{ fontFamily: fontDisplay }} className="italic text-3xl mb-10">Dónde y cuándo</h2>
      <div className="max-w-sm mx-auto space-y-8">
        <div>
          <p
            style={{ color: t.accentLight, fontFamily: fontBody }}
            className="text-[11px] uppercase tracking-widest mb-2"
          >
            Fecha
          </p>
          <p style={{ fontFamily: fontBody }} className="text-lg">{event.fechaLegible}</p>
        </div>
        <div>
          <p
            style={{ color: t.accentLight, fontFamily: fontBody }}
            className="text-[11px] uppercase tracking-widest mb-2"
          >
            Lugar
          </p>
          <p style={{ fontFamily: fontBody }} className="text-lg">{event.lugarNombre}</p>
          <p style={{ color: `${t.paper}b3`, fontFamily: fontBody }} className="text-sm mt-1">
            {event.lugarDireccion}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderColor: `${t.accentLight}80`, color: t.paper, fontFamily: fontBody }}
            className="inline-block mt-4 text-xs uppercase tracking-widest border rounded-full px-5 py-2 hover:opacity-80 transition-opacity"
          >
            Ver ubicación
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
