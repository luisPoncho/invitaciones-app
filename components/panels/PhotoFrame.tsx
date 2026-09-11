
import type { PhotoConfig, InvitationTheme } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";

export default function PhotoFrame({ config, theme }: { config: PhotoConfig, theme: InvitationTheme }) {
  const sizeClass = 
    config.frameSize === "small" ? "w-[40%] max-w-[200px]" :
    config.frameSize === "large" ? "w-[90%] max-w-[600px]" :
    "w-[65%] max-w-[400px]"; // medium

  const justifyClass = 
    config.framePosition === "left" ? "justify-start" :
    config.framePosition === "right" ? "justify-end" :
    "justify-center";

  return (
    <div className={`flex w-full py-12 px-6 ${justifyClass}`}>
      <div 
        className={`relative aspect-[3/4] ${sizeClass} shadow-2xl p-2 bg-white`}
        style={{ 
           borderColor: theme.accentLight,
           borderWidth: '1px',
           transform: config.scrollBehavior === "movimiento" ? "rotate(-2deg)" : "none" // little flair
        }}
      >
        <div className="relative w-full h-full overflow-hidden border border-gray-100">
           {config.url && (
              <img
                 src={formatImageUrl(config.url)}
                 alt=""
                 className="absolute inset-0 w-full h-full object-cover"
                 style={{ objectPosition: config.objectPosition || "center" }}
              />
           )}
        </div>
      </div>
    </div>
  );
}
