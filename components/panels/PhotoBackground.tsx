import type { PhotoConfig, InvitationTheme } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

export default function PhotoBackground({ config, theme, children }: { config: PhotoConfig, theme?: InvitationTheme, children?: React.ReactNode }) {
  const isFija = config.scrollBehavior === "fija" || config.scrollBehavior === "movimiento";
  const formattedUrl = formatImageUrl(config.url);
  
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
       <div 
         className="absolute inset-0 w-full h-full bg-center bg-cover"
         style={{
            backgroundImage: `url(${formattedUrl})`,
            backgroundAttachment: isFija ? "fixed" : "scroll",
            backgroundPosition: config.objectPosition || "center"
         }}
       ></div>
       <div className="absolute inset-0 bg-black/40"></div>
       <div className="relative z-10 w-full p-6 text-center text-white">
          {children}
       </div>
    </section>
  );
}
