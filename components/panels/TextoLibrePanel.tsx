import type { InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

interface TextoLibrePanelProps {
  theme?: InvitationTheme;
  title?: string;
  body?: string;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function TextoLibrePanel({ theme, title, body, bgUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: TextoLibrePanelProps) {
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
