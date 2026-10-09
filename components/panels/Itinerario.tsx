"use client";

import { renderIconOrEmoji } from "@/components/icons";
import type { InvitationTheme, PhotoScrollBehavior, StylePreset, ItineraryItem } from "@/lib/mock-data";
import { defaultTheme, DEFAULT_ITINERARY_ITEMS, getFontDisplayVar, getFontBodyVar } from "@/lib/mock-data";
import { formatImageUrl } from "@/lib/image-utils";
import { LeafDivider } from "./Ornaments";
import { ScrollReveal } from "@/components/motion";

interface ItinerarioProps {
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  title?: string;
  subtitle?: string;
  items?: ItineraryItem[];
  iconSize?: number;
  itineraryLayout?: "lateral" | "centrado";
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
  iconSize = 48,
  itineraryLayout = "lateral",
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
  const isCentrado = itineraryLayout === "centrado";

  const eventList = items && items.length > 0 ? items : DEFAULT_ITINERARY_ITEMS;

  const bgAttachment =
    bgScrollBehavior === "fija" ? "fixed" :
    bgScrollBehavior === "movimiento" ? "fixed" :
    "scroll";
  const bgSize = bgZoom && bgZoom > 100 ? `${bgZoom}% auto` : bgScrollBehavior === "movimiento" ? "120%" : "cover";
  const bgPosition = `${bgPositionX ?? 50}% ${bgPositionY ?? 50}%`;

  // Calcular la posición central de la línea vertical conectora (para layout lateral)
  const defaultBubbleSize = iconSize || 48;
  const lineLeftPx = defaultBubbleSize / 2;

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
          {isCentrado ? (
            /* Modo 2: Centrado (Línea central, icono sobre información sin borde circular) */
            <div className="relative mt-12 text-center">
              {/* Línea vertical conectora al centro */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5"
                style={{
                  backgroundColor: `${t.accent}35`,
                  background: `linear-gradient(to bottom, ${t.accent}20, ${t.accent}80, ${t.accent}20)`,
                }}
              />

              <div className="flex flex-col gap-10">
                {eventList.map((item, idx) => {
                  const itemSize = item.iconSize || iconSize || 48;

                  return (
                    <ScrollReveal key={item.id || idx} direction="up" delay={idx * 0.1} duration={0.5}>
                      <div className="relative flex flex-col items-center text-center group z-10">
                        {/* Icono por encima, SIN borde circular (frameless / sin fondo) */}
                        <div
                          style={{
                            width: `${itemSize}px`,
                            height: `${itemSize}px`,
                            color: t.accent,
                          }}
                          className="flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 overflow-hidden mb-2 bg-transparent"
                        >
                          {renderIconOrEmoji(item.icon, { size: itemSize, color: t.accent })}
                        </div>

                        {/* Tarjeta del evento centrada */}
                        <div
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.92)",
                            borderColor: `${t.accent}30`,
                          }}
                          className="w-full max-w-sm p-4 sm:p-5 rounded-2xl border shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5"
                        >
                          <span
                            style={{
                              backgroundColor: `${t.accent}18`,
                              color: t.accent,
                              borderColor: `${t.accent}40`,
                              fontFamily: fontBody,
                            }}
                            className="inline-block text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full border mb-2"
                          >
                            {item.time}
                          </span>

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
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Modo 1: Lateral (Clásico con burbuja circular en línea lateral) */
            <div className="relative mt-10 text-left">
              {/* Línea vertical conectora lateral */}
              <div
                className="absolute top-4 bottom-4 w-0.5"
                style={{
                  left: `${lineLeftPx}px`,
                  backgroundColor: `${t.accent}35`,
                  background: `linear-gradient(to bottom, ${t.accent}20, ${t.accent}80, ${t.accent}20)`,
                }}
              />

              <div className="flex flex-col gap-6">
                {eventList.map((item, idx) => {
                  const itemSize = item.iconSize || iconSize || 48;
                  const innerSize = Math.round(itemSize * 0.52);

                  return (
                    <ScrollReveal key={item.id || idx} direction="up" delay={idx * 0.1} duration={0.5}>
                      <div className="relative flex items-start gap-4 group">
                        {/* Icono / Burbuja */}
                        <div
                          style={{
                            width: `${itemSize}px`,
                            height: `${itemSize}px`,
                            backgroundColor: "#FFFFFF",
                            borderColor: `${t.accent}60`,
                            boxShadow: `0 4px 14px ${t.accent}25`,
                            color: t.accent,
                          }}
                          className="relative z-10 rounded-full border flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-105 overflow-hidden p-1"
                        >
                          {renderIconOrEmoji(item.icon, { size: innerSize, color: t.accent })}
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
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          )}
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
        {isCentrado ? (
          /* Modo 2 Clásico: Centrado (Línea central, icono sobre tarjeta sin borde circular) */
          <div className="relative mt-12 text-center">
            {/* Línea vertical dorada al centro */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px"
              style={{
                background: `linear-gradient(to bottom, transparent, ${t.accentLight}80 15%, ${t.accentLight}80 85%, transparent)`,
              }}
            />

            <div className="flex flex-col gap-10">
              {eventList.map((item, idx) => {
                const itemSize = item.iconSize || iconSize || 48;

                return (
                  <ScrollReveal key={item.id || idx} direction="up" delay={idx * 0.1} duration={0.5}>
                    <div className="relative flex flex-col items-center text-center group z-10">
                      {/* Icono por encima, SIN borde circular (frameless / sin fondo) */}
                      <div
                        style={{
                          width: `${itemSize}px`,
                          height: `${itemSize}px`,
                          color: t.accentLight,
                        }}
                        className="flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 overflow-hidden mb-2 bg-transparent"
                      >
                        {renderIconOrEmoji(item.icon, { size: itemSize, color: t.accentLight })}
                      </div>

                      {/* Tarjeta del evento centrada */}
                      <div
                        style={{
                          backgroundColor: `${t.secondary}CC`,
                          borderColor: `${t.accentLight}25`,
                        }}
                        className="w-full max-w-sm p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all group-hover:border-white/30 group-hover:bg-white/[0.08]"
                      >
                        <span
                          style={{
                            backgroundColor: `${t.accent}30`,
                            color: t.accentLight,
                            borderColor: `${t.accentLight}50`,
                            fontFamily: fontBody,
                          }}
                          className="inline-block text-[11px] font-bold uppercase tracking-widest px-3.5 py-0.5 rounded-full border mb-2"
                        >
                          {item.time}
                        </span>

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
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        ) : (
          /* Modo 1 Clásico: Lateral (Línea lateral con burbuja circular) */
          <div className="relative mt-10 text-left">
            {/* Línea vertical dorada lateral */}
            <div
              className="absolute top-4 bottom-4 w-px"
              style={{
                left: `${lineLeftPx}px`,
                background: `linear-gradient(to bottom, transparent, ${t.accentLight}80 15%, ${t.accentLight}80 85%, transparent)`,
              }}
            />

            <div className="flex flex-col gap-6">
              {eventList.map((item, idx) => {
                const itemSize = item.iconSize || iconSize || 48;
                const innerSize = Math.round(itemSize * 0.52);

                return (
                  <ScrollReveal key={item.id || idx} direction="up" delay={idx * 0.1} duration={0.5}>
                    <div className="relative flex items-start gap-4 group">
                      {/* Icono / Círculo */}
                      <div
                        style={{
                          width: `${itemSize}px`,
                          height: `${itemSize}px`,
                          backgroundColor: `${t.secondary}E6`,
                          borderColor: `${t.accentLight}60`,
                          boxShadow: `0 0 16px ${t.accent}30`,
                          color: t.accentLight,
                        }}
                        className="relative z-10 rounded-full border flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-105 overflow-hidden p-1"
                      >
                        {renderIconOrEmoji(item.icon, { size: innerSize, color: t.accentLight })}
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
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
