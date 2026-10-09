"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Direction the element slides from (default: "up") */
  direction?: RevealDirection;
  /** Slide distance in px (default: 30) */
  distance?: number;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Stagger delay in seconds (default: 0) */
  delay?: number;
  /** Viewport threshold 0–1 (default: 0.15) */
  threshold?: number;
  /** Only animate once (default: true) */
  once?: boolean;
  /** Additional className */
  className?: string;
  /** Element tag — renders a div by default */
  as?: "div" | "section" | "article" | "header" | "footer" | "span" | "li";
  /** Inline style overrides */
  style?: React.CSSProperties;
}

const directionOffset: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * ScrollReveal — Envuelve cualquier contenido y aplica una animación
 * "Fade‑In + Slide" cuando entra al viewport.
 *
 * ```tsx
 * <ScrollReveal direction="up" delay={0.1}>
 *   <h2>Hola mundo</h2>
 * </ScrollReveal>
 * ```
 */
export default function ScrollReveal({
  children,
  direction = "up",
  distance = 30,
  duration = 0.6,
  delay = 0,
  threshold = 0.15,
  once = true,
  className,
  as = "div",
  style,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);

  const offset = directionOffset[direction];

  // If user prefers reduced motion, render children without animation
  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      style={style}
      initial={{
        opacity: 0,
        x: offset.x * distance,
        y: offset.y * distance,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smooth natural feel
      }}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Hook helper: returns framer-motion props you can spread on any motion.* element.
 *
 * ```tsx
 * const reveal = useScrollRevealProps({ direction: "up", delay: 0.2 });
 * return <motion.div {...reveal}>...</motion.div>
 * ```
 */
export function useScrollRevealProps({
  direction = "up",
  distance = 30,
  duration = 0.6,
  delay = 0,
  threshold = 0.15,
  once = true,
}: Partial<Pick<ScrollRevealProps, "direction" | "distance" | "duration" | "delay" | "threshold" | "once">> = {}) {
  const offset = directionOffset[direction];

  return {
    initial: {
      opacity: 0,
      x: offset.x * distance,
      y: offset.y * distance,
    },
    whileInView: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    viewport: { once, amount: threshold },
    transition: {
      duration,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  } as const;
}
