"use client";
import { useState } from "react";
import type { InvitationTheme } from "@/lib/mock-data";

export default function EntryDisc({ theme, onOpen }: { theme: InvitationTheme, onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    setOpened(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${opened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: theme.primary }}>
       <div className="relative w-64 h-64 cursor-pointer" onClick={handleClick}>
          {/* Disc */}
          <div className="absolute inset-2 rounded-full shadow-xl flex items-center justify-center" style={{
             backgroundColor: "#d1d5db", 
             background: `radial-gradient(circle, #f3f4f6 20%, #d1d5db 40%, #9ca3af 80%, #d1d5db 100%)`,
             animation: opened ? "disc-slide 1s forwards" : "none"
          }}>
             {/* Center hole */}
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-inner"></div>
          </div>
          
          {/* Case cover */}
          <div className="absolute inset-0 shadow-2xl flex items-center justify-center transition-all duration-1000 z-10" style={{
             backgroundColor: theme.secondary,
             opacity: opened ? 0 : 1,
             transform: opened ? "scale(0.95)" : "scale(1)",
             borderRight: `2px solid ${theme.accentLight}`
          }}>
             <span className="font-display italic text-2xl" style={{ color: theme.paper }}>Invitación</span>
          </div>
       </div>
       {!opened && (
        <p className="absolute bottom-1/4 font-body text-xs tracking-widest text-white/50 uppercase">Toca para abrir</p>
       )}
    </div>
  );
}
