import type { InvitationTheme, PhotoScrollBehavior, StylePreset, ItineraryItem } from "@/lib/mock-data";
import { defaultTheme, DEFAULT_ITINERARY_ITEMS, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import { LeafDivider } from "./Ornaments";

interface ItinerarioProps {
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  title?: string;
  subtitle?: string;
  items?: ItineraryItem[];
  bgUrl?: string;
  bgScrollBehavior?: PhotoScrollBehavior;
  bgPositionX?: number;
  bgPositionY?: number;
  bgZoom?: number;
}

export default function Itinerario({
  theme,
  stylePreset = "clasico",
  title,
  subtitle,
  items,
  bgUrl,
  bgScrollBehavior,
  bgPositionX,
  bgPositionY,
  bgZoom,
}: ItinerarioProps) {
  const t = { ...defaultTheme, ...theme };
  const fontDisplay = getFontDisplayVar(t.fontDisplay);
  const fontBody = getFontBodyVar(t.fontBody);
  const formattedBgUrl = formatImageUrl(bgUrl);
  const isRomantico = stylePreset === "romantico";

  const eventList = items && items.length > 0 ? items : DEFAULT_ITINERARY_ITEMS;

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
        {formattedBgUrl && <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-0" />}

        <div className="relative z-10 max-w-lg mx-auto">
          <p
            style={{ color: t.accent, fontFamily: fontBody }}
            className="text-xs uppercase tracking-[0.25em] mb-2 font-medium"
          >
            {subtitle || "Cronograma del Gran Día"}
          </p>

          <h2
            style={{ fontFamily: fontDisplay, color: t.primary }}
            className="italic text-4xl sm:text-5xl mb-2 font-normal"
          >
            {title || "Itinerario"}
          </h2>

          <div className="my-4">
            <LeafDivider color={t.accent} />
          </div>

          {/* Timeline de Eventos */}
          <div className="relative mt-10 text-left">
            {/* Línea vertical conectora central */}
            <div
              className="absolute left-6 top-4 bottom-4 w-0.5"
              style={{
                backgroundColor: `${t.accent}35`,
                background: `linear-gradient(to bottom, ${t.accent}20, ${t.accent}80, ${t.accent}20)`,
              }}
            />

            <div className="flex flex-col gap-6">
              {eventList.map((item, idx) => (
                <div key={item.id || idx} className="relative flex items-start gap-4 group">
                  {/* Icono / Burbuja */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: `${t.accent}60`,
                      boxShadow: `0 4px 14px ${t.accent}25`,
                    }}
                    className="relative z-10 w-12 h-12 rounded-full border flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-105"
                  >
                    <span>{item.icon || "✨"}</span>
                  </div>

                  {/* Contenido del Evento */}
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderColor: `${t.accent}30`,
                    }}
                    className="flex-1 p-4 sm:p-5 rounded-2xl border shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span
                        style={{
                          backgroundColor: `${t.accent}18`,
                          color: t.accent,
                          borderColor: `${t.accent}40`,
                          fontFamily: fontBody,
                        }}
                        className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border"
                      >
                        {item.time}
                      </span>
                    </div>

                    <h3
                      style={{ fontFamily: fontDisplay, color: t.primary }}
                      className="text-xl italic font-medium leading-tight mb-1"
                    >
                      {item.title}
                    </h3>

                    {item.description && (
                      <p
                        style={{ color: `${t.primary}99`, fontFamily: fontBody }}
                        className="text-xs leading-relaxed"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Estilo Clásico
  return (
    <section
      style={{
        backgroundColor: t.primary,
        color: t.paper,
        ...(formattedBgUrl ? {
          backgroundImage: `url(${formattedBgUrl})`,
          backgroundSize: bgSize,
          backgroundPosition: bgPosition,
          backgroundAttachment: bgAttachment,
        } : {}),
      }}
      className="relative text-center py-20 px-6 overflow-hidden"
    >
      {formattedBgUrl && <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-0" />}

      <div className="relative z-10 max-w-lg mx-auto">
        <p
          style={{ color: t.accentLight, fontFamily: fontBody }}
          className="text-xs uppercase tracking-[0.25em] mb-2 font-medium"
        >
          {subtitle || "Cronograma del Evento"}
        </p>

        <h2
          style={{ fontFamily: fontDisplay, color: t.paper }}
          className="italic text-4xl sm:text-5xl mb-4 font-normal tracking-wide"
        >
          {title || "Itinerario"}
        </h2>

        {/* Decoración dorada */}
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="h-px w-12" style={{ backgroundColor: `${t.accentLight}50` }} />
          <span style={{ color: t.accentLight }} className="text-xs font-serif">✦</span>
          <div className="h-px w-12" style={{ backgroundColor: `${t.accentLight}50` }} />
        </div>

        {/* Timeline Clásico */}
        <div className="relative mt-10 text-left">
          {/* Línea vertical dorada */}
          <div
            className="absolute left-6 top-4 bottom-4 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${t.accentLight}80 15%, ${t.accentLight}80 85%, transparent)`,
            }}
          />

          <div className="flex flex-col gap-6">
            {eventList.map((item, idx) => (
              <div key={item.id || idx} className="relative flex items-start gap-4 group">
                {/* Icono / Círculo */}
                <div
                  style={{
                    backgroundColor: `${t.secondary}E6`,
                    borderColor: `${t.accentLight}60`,
                    boxShadow: `0 0 16px ${t.accent}30`,
                  }}
                  className="relative z-10 w-12 h-12 rounded-full border flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-105"
                >
                  <span>{item.icon || "✦"}</span>
                </div>

                {/* Tarjeta del evento */}
                <div
                  style={{
                    backgroundColor: `${t.secondary}B3`,
                    borderColor: `${t.accentLight}25`,
                  }}
                  className="flex-1 p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all group-hover:border-white/30 group-hover:bg-white/[0.08]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <span
                      style={{
                        backgroundColor: `${t.accent}30`,
                        color: t.accentLight,
                        borderColor: `${t.accentLight}50`,
                        fontFamily: fontBody,
                      }}
                      className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border"
                    >
                      {item.time}
                    </span>
                  </div>

                  <h3
                    style={{ fontFamily: fontDisplay, color: t.paper }}
                    className="text-lg sm:text-xl font-medium tracking-wide leading-tight mb-1"
                  >
                    {item.title}
                  </h3>

                  {item.description && (
                    <p
                      style={{ color: `${t.paper}B3`, fontFamily: fontBody }}
                      className="text-xs leading-relaxed"
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
