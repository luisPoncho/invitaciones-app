import type { InvitationTheme, PhotoScrollBehavior } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";

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
  
  if (!photoUrl) {
    // Placeholder si no hay foto
    return (
      <section style={{ backgroundColor: t.primary }} className="w-full h-64 flex items-center justify-center opacity-50">
        <span className="text-white text-xs uppercase tracking-widest">Sin imagen de fondo</span>
      </section>
    );
  }

  const isFija = bgScrollBehavior === "fija" || bgScrollBehavior === "movimiento";
  const bgSize = bgZoom && bgZoom > 100 ? `${bgZoom}% auto` : bgScrollBehavior === "movimiento" ? "120%" : "cover";
  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
       <div 
         className="absolute inset-0 w-full h-full bg-center"
         style={{
            backgroundImage: `url(${photoUrl})`,
            backgroundAttachment: isFija ? "fixed" : "scroll",
            backgroundSize: bgSize,
            backgroundPosition: bgPosition
         }}
       ></div>
    </section>
  );
}
