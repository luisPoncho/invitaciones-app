"use client";
import { useState } from "react";
import type { InvitationTheme } from "@/lib/mock-data";

export default function EntryEnvelope({ theme, onOpen }: { theme: InvitationTheme, onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    setOpened(true);
    setTimeout(() => {
      onOpen();
    }, 1500); // Wait for animation
  };

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${opened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: theme.primary }}>
      <div className="relative w-64 h-48 cursor-pointer" onClick={handleClick} style={{ perspective: "1000px" }}>
        {/* Envelope back */}
        <div className="absolute inset-0 shadow-xl" style={{ backgroundColor: theme.secondary, borderRadius: '8px' }}></div>

        {/* Letter */}
        <div className="absolute inset-2 flex items-center justify-center shadow-md" style={{
          backgroundColor: theme.paper,
          animation: opened ? "letter-pull 1s 0.5s forwards" : "none"
        }}>
        </div>

        {/* Envelope front flaps */}
        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none" style={{
          clipPath: "polygon(0 100%, 50% 40%, 100% 100%, 100% 100%, 0 100%)",
          backgroundColor: theme.accent,
          opacity: 0.9,
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px'
        }}></div>

        {/* Envelope top flap */}
        <div className="absolute top-0 left-0 w-full h-1/2 origin-top transition-transform duration-500 z-10" style={{
          backgroundColor: theme.accentLight,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transform: opened ? "rotateX(180deg)" : "rotateX(0deg)"
        }}></div>
      </div>
      {!opened && (
        <p className="absolute bottom-1/4 font-body text-xs tracking-widest text-white/50 uppercase">Toca para abrir</p>
      )}
    </div>
  );
}
