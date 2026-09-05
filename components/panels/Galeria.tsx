
import type { PhotoConfig, InvitationTheme } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";
import PhotoBackground from "./PhotoBackground";
import PhotoFrame from "./PhotoFrame";

interface GaleriaProps {
  photoConfigs: PhotoConfig[];
  theme?: InvitationTheme;
}

export default function Galeria({ photoConfigs, theme }: GaleriaProps) {
  const t = { ...defaultTheme, ...theme };
  
  if (!photoConfigs || photoConfigs.length === 0) return null;

  const galeriaPhotos = photoConfigs.filter(p => p.displayMode === "galeria" && p.url);
  const specialPhotos = photoConfigs.filter(p => p.displayMode !== "galeria" && p.url);

  return (
    <>
      {specialPhotos.map((p, i) => (
         p.displayMode === "fondo" ? (
            <PhotoBackground key={`bg-${i}`} config={p} theme={t} />
         ) : (
            <div key={`fr-${i}`} style={{ backgroundColor: t.paper }}>
               <PhotoFrame config={p} theme={t} />
            </div>
         )
      ))}

      {galeriaPhotos.length > 0 && (
        <section
          style={{ backgroundColor: t.paper }}
          className="py-20 px-6"
        >
          <h2
            style={{ color: t.primary }}
            className="font-display italic text-3xl text-center mb-10"
          >
            Nuestros momentos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
            {galeriaPhotos.map((p, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden group">
                <img
                  src={p.url}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${p.scrollBehavior === 'movimiento' ? 'hover:scale-110' : ''}`}
                  style={{ objectPosition: p.objectPosition || "center" }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
