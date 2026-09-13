import type { EventData, InvitationTheme, PhotoScrollBehavior, StylePreset } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import { FloralFrame, FloralDivider, LeafAccent } from "./Ornaments";

interface PortadaProps {
  event: EventData;
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function Portada({ event, theme, stylePreset = "clasico", bgUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: PortadaProps) {
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

  if (stylePreset === "romantico") {
    return (
      <section
        style={{
          backgroundColor: t.paper,
          color: t.primary,
          ...(formattedBgUrl ? {
            backgroundImage: `url(${formattedBgUrl})`,
            backgroundSize: bgSize,
            backgroundPosition: bgPosition,
            backgroundAttachment: bgAttachment,
          } : {}),
        }}
        className="min-h-[100svh] relative overflow-hidden"
      >
        {formattedBgUrl && <div className="absolute inset-0 bg-white/60 z-0" />}

        {/* Floral frame ornament */}
        <FloralFrame color={t.accent} className="z-10" />

        {/* Subtle border frame */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            inset: "24px",
            border: `1px solid ${t.accent}40`,
            borderRadius: "8px",
          }}
        />

        <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center min-h-[100svh]">
          {/* Top ornament */}
          <LeafAccent color={t.accent} className="w-12 h-6 mb-6 opacity-60" />

          <p
            style={{ color: t.accent, fontFamily: fontBody }}
            className="text-xs tracking-[0.4em] uppercase mb-4"
          >
            Nos casamos
          </p>

          <h1
            style={{ fontFamily: fontDisplay, color: t.primary }}
            className="text-5xl sm:text-7xl leading-tight max-w-md"
          >
            {event.anfitriones}
          </h1>

          <FloralDivider color={t.accent} className="w-48 h-10 mt-6 mb-4 opacity-70" />

          <p
            style={{ color: `${t.primary}bb`, fontFamily: fontBody }}
            className="text-sm mt-2 max-w-xs leading-relaxed"
          >
            {event.mensaje}
          </p>

          <div
            style={{ borderColor: `${t.accent}55`, backgroundColor: `${t.accent}10` }}
            className="mt-10 border rounded-full px-8 py-2.5"
          >
            <span
              style={{ color: t.accent, fontFamily: fontBody }}
              className="text-xs tracking-widest uppercase font-medium"
            >
              {event.fechaLegible}
            </span>
          </div>

          {/* Bottom ornament */}
          <LeafAccent color={t.accent} className="w-12 h-6 mt-8 opacity-60" />
        </div>
      </section>
    );
  }

  // ── Estilo Clásico (default) ──
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
