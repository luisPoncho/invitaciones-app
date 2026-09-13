import type { InvitationTheme, PhotoScrollBehavior, StylePreset } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import { LeafDivider } from "./Ornaments";

interface MesaRegalosProps {
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  title?: string;
  body?: string;
  url?: string;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function MesaRegalos({
  theme,
  stylePreset = "clasico",
  title,
  body,
  url,
  bgUrl,
  bgScrollBehavior,
  bgPositionX,
  bgPositionY,
  bgZoom,
}: MesaRegalosProps) {
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
        {formattedBgUrl && <div className="absolute inset-0 bg-white/75 z-0" />}
        <div className="relative z-10 max-w-md mx-auto">
          <div
            style={{ backgroundColor: `${t.accent}15`, borderColor: `${t.accent}30` }}
            className="w-14 h-14 mx-auto rounded-full border flex items-center justify-center text-2xl mb-3"
          >
            🎁
          </div>
          <p
            style={{ color: t.accent, fontFamily: fontBody }}
            className="text-xs uppercase tracking-[0.25em] mb-1 font-medium"
          >
            Detalles y Agradecimientos
          </p>
          <h2 style={{ fontFamily: fontDisplay, color: t.primary }} className="italic text-4xl mb-2 font-normal">
            {title || "Mesa de Regalos"}
          </h2>
          <div className="my-3">
            <LeafDivider color={t.accent} />
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderColor: `${t.accent}30`,
            }}
            className="mt-6 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6"
          >
            <p style={{ fontFamily: fontBody, color: `${t.primary}cc` }} className="text-sm leading-relaxed">
              {body || "El mejor regalo es tu presencia. Sin embargo, si deseas tener un detalle con nosotros, puedes ver nuestra mesa de regalos aquí."}
            </p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: t.accent, color: "#FFFFFF", fontFamily: fontBody }}
                className="inline-block text-xs uppercase tracking-widest rounded-2xl px-8 py-3.5 hover:opacity-90 transition-all font-medium shadow-md"
              >
                Ver Mesa de Regalos
              </a>
            )}
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
      className="relative text-center"
    >
      {bgUrl && <div className="absolute inset-0 bg-black/50 z-0" />}
      <div className="relative z-10 py-20 px-6">
        <h2 style={{ fontFamily: fontDisplay }} className="italic text-3xl mb-6">
          {title || "Mesa de Regalos"}
        </h2>
        <div className="max-w-sm mx-auto space-y-8">
          <p style={{ fontFamily: fontBody }} className="text-sm">
            {body || "El mejor regalo es tu presencia. Sin embargo, si deseas tener un detalle con nosotros, puedes ver nuestra mesa de regalos aquí."}
          </p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: t.accent, color: t.paper, fontFamily: fontBody }}
              className="inline-block mt-4 text-xs uppercase tracking-widest rounded-md px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Ver Mesa de Regalos
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
