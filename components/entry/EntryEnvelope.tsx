"use client";

import { useState } from "react";
import type { InvitationTheme } from "@/lib/mock-data";

export default function EntryEnvelope({
  theme,
  onOpen,
}: {
  theme: InvitationTheme;
  onOpen: () => void;
}) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (opened) return;

    setOpened(true);

    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${opened
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
        }`}
      style={{
        backgroundColor: theme.primary,
      }}
    >
      {/* Ambient glow */}
      <div
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
      />

      {/* Subtle decorative circles */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full border opacity-10 pointer-events-none"
        style={{
          borderColor: theme.accentLight,
        }}
      />

      <div
        className="absolute w-[520px] h-[520px] rounded-full border opacity-5 pointer-events-none"
        style={{
          borderColor: theme.accentLight,
        }}
      />

      {/* Envelope area */}
      <div
        className="relative w-[330px] h-[245px] cursor-pointer"
        onClick={handleClick}
        style={{
          perspective: "1200px",
        }}
      >
        {/* Soft shadow underneath */}
        <div
          className="absolute left-1/2 top-[92%] -translate-x-1/2 w-[280px] h-[35px] rounded-full blur-2xl opacity-40"
          style={{
            backgroundColor: "#000",
          }}
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
        <div
          className="absolute left-[7%] right-[7%] top-[8%] h-[82%] flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: theme.paper,
            borderRadius: "4px",
            animation: opened
              ? "letter-pull 1s 0.45s cubic-bezier(.2,.8,.2,1) forwards"
              : "none",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.18)",
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
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              border: `1px solid ${theme.accent}55`,
              color: theme.accent,
            }}
          >
            <span className="text-lg">✦</span>
          </div>
        </div>

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
        <div
          className="absolute top-0 left-0 w-full h-[55%] origin-top transition-transform duration-700 ease-in-out z-30"
          style={{
            backgroundColor: theme.accentLight,
            clipPath:
              "polygon(0 0, 100% 0, 50% 100%)",
            transform: opened
              ? "rotateX(180deg)"
              : "rotateX(0deg)",
            backfaceVisibility: "hidden",
            filter:
              "drop-shadow(0 4px 6px rgba(0,0,0,0.12))",
          }}
        />

        {/* Wax seal */}
        {!opened && (
          <div
            className="absolute z-40 left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-xl"
              style={{
                backgroundColor: theme.accent,
                border: `2px solid ${theme.accentLight}80`,
                boxShadow:
                  "0 6px 18px rgba(0,0,0,0.28), inset 0 1px 2px rgba(255,255,255,0.25)",
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
            </div>
          </div>
        )}
      </div>

      {/* Instruction */}
      {!opened && (
        <div className="absolute bottom-[18%] flex flex-col items-center gap-3">
          <p
            className="font-body text-[10px] tracking-[0.35em] uppercase"
            style={{
              color: theme.paper,
              opacity: 0.65,
            }}
          >
            Toca para abrir
          </p>

          <div
            className="w-8 h-px opacity-40"
            style={{
              backgroundColor: theme.accentLight,
            }}
          />
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes letter-pull {
          0% {
            transform: translateY(0) scale(1);
          }

          100% {
            transform: translateY(-135px) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}