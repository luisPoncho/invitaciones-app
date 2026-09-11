
import type { PhotoConfig, InvitationTheme } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import PhotoBackground from "./PhotoBackground";
import PhotoFrame from "./PhotoFrame";

interface GaleriaProps {
  photoConfigs?: PhotoConfig[];
  fotos?: string[];
  theme?: InvitationTheme;
}

export default function Galeria({ photoConfigs, fotos, theme }: GaleriaProps) {
  const t = { ...defaultTheme, ...theme };

  // Sincronizar / obtener photoConfigs efectivas
  let effectiveConfigs: PhotoConfig[] = photoConfigs ? [...photoConfigs] : [];

  // Si effectiveConfigs no tiene URLs válidas pero tenemos el arreglo fotos, usar fotos
  const hasConfigUrls = effectiveConfigs.some(p => p && p.url && p.url.trim() !== "");
  if (!hasConfigUrls && fotos && fotos.length > 0) {
    effectiveConfigs = fotos
      .filter(url => url && url.trim() !== "")
      .map(url => ({
        url,
        scrollBehavior: "normal",
        displayMode: "galeria",
      }));
  }

  const galeriaPhotos = effectiveConfigs.filter(p => p && p.displayMode === "galeria" && p.url);
  const specialPhotos = effectiveConfigs.filter(p => p && p.displayMode !== "galeria" && p.url);

  const hasPhotos = galeriaPhotos.length > 0 || specialPhotos.length > 0;

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

        {hasPhotos ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
            {galeriaPhotos.map((p, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden group">
                <img
                  src={formatImageUrl(p.url)}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${p.scrollBehavior === 'movimiento' ? 'hover:scale-110' : ''}`}
                  style={{ objectPosition: p.objectPosition || "center" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-black/10 bg-black/5 text-center">
            <svg className="w-12 h-12 mb-3 opacity-30" style={{ color: t.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm font-medium opacity-70 mb-1" style={{ color: t.primary }}>
              Galería de fotos vacía
            </p>
            <p className="text-xs opacity-50 max-w-xs" style={{ color: t.primary }}>
              Agrega URLs de tus fotografías en la pestaña de Diseño para mostrarlas aquí.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
