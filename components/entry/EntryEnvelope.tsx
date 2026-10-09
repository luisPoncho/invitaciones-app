"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { InvitationTheme } from "@/lib/mock-data";

export default function EntryEnvelope({
  theme,
  onOpen,
}: {
  theme: InvitationTheme;
  onOpen: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleClick = () => {
    if (opened) return;

    setOpened(true);

    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: theme.primary,
      }}
      animate={opened ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1, delay: opened ? 0.5 : 0, ease: "easeInOut" }}
      {...(opened ? { "data-closing": "true" } : {})}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at center,
              ${theme.accent}30 0%,
              transparent 42%
            )
          `,
        }}
        animate={opened ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Subtle decorative circles */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full border opacity-10 pointer-events-none"
        style={{ borderColor: theme.accentLight }}
        animate={opened ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full border opacity-5 pointer-events-none"
        style={{ borderColor: theme.accentLight }}
        animate={opened ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Floating particles effect */}
      {!opened && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{
                backgroundColor: `${theme.accentLight}60`,
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* Envelope area */}
      <motion.div
        className="relative w-[330px] h-[245px] cursor-pointer"
        onClick={handleClick}
        style={{ perspective: "1200px" }}
        initial={false}
        animate={opened ? { y: -30 } : { y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        // Idle breathing animation
        {...(!opened && !prefersReducedMotion
          ? {}
          : {})}
      >
        {/* Soft shadow underneath */}
        <motion.div
          className="absolute left-1/2 top-[92%] -translate-x-1/2 w-[280px] h-[35px] rounded-full blur-2xl"
          style={{ backgroundColor: "#000" }}
          animate={opened ? { opacity: 0, scaleX: 0.5 } : { opacity: 0.4, scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Envelope back */}
        <div
          className="absolute inset-0 overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.secondary,
            borderRadius: "10px",
            boxShadow: `
              0 25px 60px rgba(0,0,0,0.35),
              0 8px 20px rgba(0,0,0,0.2),
              inset 0 1px 0 rgba(255,255,255,0.12)
            `,
          }}
        >
          {/* Inner border */}
          <div
            className="absolute inset-[7px] rounded-[6px] pointer-events-none"
            style={{
              border: `1px solid ${theme.accentLight}25`,
            }}
          />

          {/* Subtle texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "7px 7px",
            }}
          />
        </div>

        {/* Letter */}
        <motion.div
          className="absolute left-[7%] right-[7%] top-[8%] h-[82%] flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: theme.paper,
            borderRadius: "4px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
          }}
          animate={
            opened
              ? { y: -135, scale: 1.03 }
              : { y: 0, scale: 1 }
          }
          transition={{
            duration: 1,
            delay: opened ? 0.45 : 0,
            ease: [0.2, 0.8, 0.2, 1],
          }}
        >
          {/* Letter border */}
          <div
            className="absolute inset-[9px] border pointer-events-none"
            style={{
              borderColor: `${theme.accent}35`,
            }}
          />

          {/* Small decorative seal */}
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              border: `1px solid ${theme.accent}55`,
              color: theme.accent,
            }}
            animate={
              !opened
                ? {
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.05, 1],
                  }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-lg">✦</span>
          </motion.div>
        </motion.div>

        {/* Lower envelope fold */}
        <div
          className="absolute inset-0 flex flex-col justify-end pointer-events-none z-20"
          style={{
            clipPath:
              "polygon(0 100%, 50% 43%, 100% 100%, 100% 100%, 0 100%)",
            backgroundColor: theme.accent,
            opacity: 0.95,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.08))",
          }}
        />

        {/* Left fold */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            clipPath: "polygon(0 0, 50% 50%, 0 100%)",
            backgroundColor: theme.secondary,
            opacity: 0.9,
          }}
        />

        {/* Right fold */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            clipPath: "polygon(100% 0, 50% 50%, 100% 100%)",
            backgroundColor: theme.secondary,
            opacity: 0.9,
          }}
        />

        {/* Top flap */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[55%] origin-top z-30"
          style={{
            backgroundColor: theme.accentLight,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backfaceVisibility: "hidden",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.12))",
          }}
          animate={opened ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        {/* Wax seal */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              className="absolute z-40 left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2"
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <motion.div
                className="w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-xl"
                style={{
                  backgroundColor: theme.accent,
                  border: `2px solid ${theme.accentLight}80`,
                  boxShadow:
                    "0 6px 18px rgba(0,0,0,0.28), inset 0 1px 2px rgba(255,255,255,0.25)",
                }}
                animate={{
                  boxShadow: [
                    "0 6px 18px rgba(0,0,0,0.28), inset 0 1px 2px rgba(255,255,255,0.25)",
                    `0 6px 24px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.25), 0 0 15px ${theme.accent}40`,
                    "0 6px 18px rgba(0,0,0,0.28), inset 0 1px 2px rgba(255,255,255,0.25)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                  style={{
                    border: `1px solid ${theme.accentLight}80`,
                  }}
                >
                  <span
                    className="text-lg"
                    style={{
                      color: theme.accentLight,
                    }}
                  >
                    ✦
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Instruction */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="absolute bottom-[18%] flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p
              className="font-body text-[10px] tracking-[0.35em] uppercase"
              style={{
                color: theme.paper,
                opacity: 0.65,
              }}
              animate={{
                opacity: [0.45, 0.75, 0.45],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Toca para abrir
            </motion.p>

            <motion.div
              className="w-8 h-px"
              style={{
                backgroundColor: theme.accentLight,
              }}
              animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.8, 1, 0.8] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}