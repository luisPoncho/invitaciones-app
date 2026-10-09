"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface MotionButtonProps extends HTMLMotionProps<"button"> {
  /** Scale factor on hover (default: 1.05) */
  hoverScale?: number;
  /** Scale factor on tap/press (default: 0.95) */
  tapScale?: number;
  /** Transition duration in seconds (default: 0.2) */
  duration?: number;
  /** Extra CSS class names */
  className?: string;
  children: React.ReactNode;
}

/**
 * MotionButton — A button with premium micro-interactions.
 *
 * - Hover  → scale(1.05) + subtle lift shadow
 * - Tap    → scale(0.95) for satisfying press feel
 * - Smooth spring-based easing
 *
 * Wraps a standard `<button>` so all native props (onClick, type, disabled, etc.) pass through.
 */
export default function MotionButton({
  children,
  hoverScale = 1.05,
  tapScale = 0.95,
  duration = 0.2,
  className = "",
  ...rest
}: MotionButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <button className={className} {...(rest as any)}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      className={className}
      whileHover={{
        scale: hoverScale,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
      whileTap={{
        scale: tapScale,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
      transition={{ duration }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export interface MotionLinkProps extends HTMLMotionProps<"a"> {
  children: React.ReactNode;
  hoverScale?: number;
  tapScale?: number;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * MotionLink — An anchor tag with the same micro-interactions as MotionButton.
 */
export function MotionLink({
  children,
  hoverScale = 1.05,
  tapScale = 0.95,
  className = "",
  ...rest
}: MotionLinkProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <a className={className} {...(rest as any)}>
        {children}
      </a>
    );
  }

  return (
    <motion.a
      className={className}
      whileHover={{
        scale: hoverScale,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
      whileTap={{
        scale: tapScale,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

