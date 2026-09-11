import type { EventData, InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

interface PortadaProps {
  event: EventData;
  theme?: InvitationTheme;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function Portada({ event, theme, bgUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: PortadaProps) {
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

  return (
    <section
      style={{
        backgroundColor: t.primary,
        color: t.paper,
        ...(formattedBgUrl ? {
          backgroundImage: `url(${formattedBgUrl})`,
          backgroundSize: bgSize,
          backgroundPosition: bgPosition,
          backgroundAttachment: bgAttachment,
        } : {}),
      }}
      className="min-h-[100svh] relative overflow-hidden"
    >
      {bgUrl && <div className="absolute inset-0 bg-black/50 z-0" />}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center min-h-[100svh]">
      <p
        style={{ color: t.accentLight, fontFamily: fontBody }}
        className="text-xs tracking-[0.3em] uppercase mb-6"
      >
        Nos casamos
      </p>
      <h1 style={{ fontFamily: fontDisplay }} className="italic text-5xl sm:text-6xl leading-tight max-w-md">
        {event.anfitriones}
      </h1>
      <p style={{ color: `${t.paper}cc`, fontFamily: fontBody }} className="text-sm mt-8 max-w-xs">
        {event.mensaje}
      </p>
      <div
        style={{ borderColor: `${t.accentLight}66` }}
        className="mt-10 border rounded-full px-6 py-2"
      >
        <span
          style={{ color: t.accentLight, fontFamily: fontBody }}
          className="text-xs tracking-widest uppercase"
        >
          {event.fechaLegible}
        </span>
      </div>
      </div>
    </section>
  );
}
