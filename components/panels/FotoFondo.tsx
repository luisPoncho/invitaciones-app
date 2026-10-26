import type { InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import SectionBackground from "./SectionBackground";

interface FotoFondoProps {
  theme?: InvitationTheme;
  photoUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function FotoFondo({ theme, photoUrl, bgScrollBehavior, bgPositionX, bgPositionY, bgZoom }: FotoFondoProps) {
  const t = { ...defaultTheme, ...theme };
  const formattedUrl = formatImageUrl(photoUrl);
  
  if (!formattedUrl) {
    // Placeholder si no hay foto
    return (
      <section style={{ backgroundColor: t.primary }} className="w-full h-64 flex items-center justify-center opacity-50">
        <span className="text-white text-xs uppercase tracking-widest">Sin imagen de fondo</span>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[calc(var(--inv-vh,100vh)*0.6)] flex items-center justify-center overflow-hidden">
      <SectionBackground url={formattedUrl} behavior={bgScrollBehavior} positionX={bgPositionX} positionY={bgPositionY} zoom={bgZoom} />
    </section>
  );
}
