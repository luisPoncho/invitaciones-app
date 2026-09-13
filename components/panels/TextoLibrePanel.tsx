import type { InvitationTheme, PhotoScrollBehavior, StylePreset } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import { LeafDivider } from "./Ornaments";

interface TextoLibrePanelProps {
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  title?: string;
  body?: string;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function TextoLibrePanel({
  theme,
  stylePreset = "clasico",
  title,
  body,
  bgUrl,
  bgScrollBehavior,
  bgPositionX,
  bgPositionY,
  bgZoom,
}: TextoLibrePanelProps) {
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
        <div className="relative z-10 max-w-lg mx-auto space-y-4">
          {title && (
            <>
              <h2 style={{ fontFamily: fontDisplay, color: t.primary }} className="italic text-4xl font-normal">
                {title}
              </h2>
              <div className="my-2">
                <LeafDivider color={t.accent} />
              </div>
            </>
          )}
          {body && (
            <p
              style={{
                fontFamily: fontBody,
                color: `${t.primary}cc`,
                whiteSpace: "pre-line",
              }}
              className="text-sm sm:text-base leading-relaxed italic max-w-md mx-auto"
            >
              {body}
            </p>
          )}
        </div>
      </section>
    );
  }

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
      className="relative text-center py-20 px-6"
    >
      {formattedBgUrl && <div className="absolute inset-0 bg-black/40 z-0" />}
      <div className={`relative z-10 max-w-lg mx-auto space-y-6 ${formattedBgUrl ? 'text-white' : ''}`}>
        {title && (
          <h2 style={{ fontFamily: fontDisplay }} className="italic text-3xl">
            {title}
          </h2>
        )}
        {body && (
          <p style={{ fontFamily: fontBody, whiteSpace: 'pre-line' }} className="text-sm leading-relaxed">
            {body}
          </p>
        )}
      </div>
    </section>
  );
}
