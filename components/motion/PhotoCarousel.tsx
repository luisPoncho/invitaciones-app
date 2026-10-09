"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { AppIcon } from "@/components/icons";

interface PhotoCarouselProps {
  /** Array of image URLs */
  photos: string[];
  /** Theme accent color for dots & buttons */
  accentColor?: string;
  /** Accent light color for inactive dots */
  accentLightColor?: string;
  /** Auto-advance interval in ms (0 = disabled). Default: 0 */
  autoPlayMs?: number;
  /** Gallery title (e.g. "Nuestros Momentos") */
  title?: string;
  /** CSS class on the outer wrapper */
  className?: string;
}

// Slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
    zIndex: 0,
  }),
};

// Lightbox variants
const lightboxOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const lightboxImageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

/**
 * PhotoCarousel — Carrusel interactivo de fotografías con:
 *   • Transiciones suaves entre slides
 *   • Gestos táctiles (drag/swipe)
 *   • Botones de navegación lateral
 *   • Puntos indicadores (dots)
 *   • Lightbox modal con zoom al hacer clic
 *   • Autoplay opcional
 */
export default function PhotoCarousel({
  photos,
  accentColor = "#B08D3F",
  accentLightColor = "#D9C48B",
  autoPlayMs = 0,
  className = "",
}: PhotoCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const imageIndex = ((page % photos.length) + photos.length) % photos.length;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prev]) => [prev + newDirection, newDirection]);
    },
    []
  );

  // Autoplay
  useEffect(() => {
    if (autoPlayMs <= 0 || photos.length <= 1) return;

    intervalRef.current = setInterval(() => {
      paginate(1);
    }, autoPlayMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlayMs, photos.length, paginate]);

  // Pause autoplay when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [lightboxIndex]);

  const handleDragEnd = (_: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const goToSlide = (index: number) => {
    const dir = index > imageIndex ? 1 : -1;
    setPage([index, dir]);
  };

  if (!photos || photos.length === 0) return null;

  // If only one photo, show it directly
  if (photos.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={photos[0]}
            alt="Foto"
            className="w-full h-full object-cover"
          />
        </div>
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          accentColor={accentColor}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* ── Carousel ──────────────────────────────────── */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={prefersReducedMotion ? undefined : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            onClick={() => setLightboxIndex(imageIndex)}
          >
            <img
              src={photos[imageIndex]}
              alt={`Foto ${imageIndex + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />
            {/* Subtle gradient overlay at bottom for dots readability */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation buttons ──────────────────────── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            border: `1px solid rgba(255,255,255,0.3)`,
          }}
          aria-label="Foto anterior"
        >
          <AppIcon name="chevron-left" size={18} color="white" strokeWidth={2.5} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            border: `1px solid rgba(255,255,255,0.3)`,
          }}
          aria-label="Foto siguiente"
        >
          <AppIcon name="chevron-right" size={18} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Dots ──────────────────────────────────────── */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ir a foto ${i + 1}`}
            className="relative w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === imageIndex ? accentColor : `${accentLightColor}50`,
              transform: i === imageIndex ? "scale(1.3)" : "scale(1)",
              boxShadow:
                i === imageIndex ? `0 0 8px ${accentColor}60` : "none",
            }}
          />
        ))}
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(dir) => {
          if (lightboxIndex === null) return;
          const next =
            ((lightboxIndex + dir) % photos.length + photos.length) %
            photos.length;
          setLightboxIndex(next);
        }}
        accentColor={accentColor}
      />
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  Lightbox sub-component                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
  accentColor = "#B08D3F",
}: {
  photos: string[];
  index: number | null;
  onClose: () => void;
  onNavigate?: (dir: number) => void;
  accentColor?: string;
}) {
  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (index !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    if (index === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate?.(-1);
      if (e.key === "ArrowRight") onNavigate?.(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          variants={lightboxOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <AppIcon name="close" size={20} color="white" />
          </button>

          {/* Navigation buttons */}
          {onNavigate && photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(-1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Foto anterior"
              >
                <AppIcon name="chevron-left" size={20} color="white" strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Foto siguiente"
              >
                <AppIcon name="chevron-right" size={20} color="white" strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Image */}
          <motion.img
            key={index}
            src={photos[index]}
            alt={`Foto ampliada ${index + 1}`}
            className="relative z-[1] max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            variants={lightboxImageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
            <span
              className="text-xs tracking-wider font-medium px-3 py-1 rounded-full backdrop-blur-md"
              style={{
                color: "white",
                backgroundColor: `${accentColor}50`,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {index + 1} / {photos.length}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
