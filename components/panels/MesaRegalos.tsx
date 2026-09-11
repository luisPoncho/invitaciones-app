import type { InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

interface MesaRegalosProps {
  theme?: InvitationTheme;
  title?: string;
  body?: string;
  url?: string;
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function MesaRegalos({ theme, title, body, url, bgUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: MesaRegalosProps) {
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
