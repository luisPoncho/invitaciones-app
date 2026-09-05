"use client";
import { useState } from "react";
import type { InvitationTheme } from "@/lib/mock-data";

export default function EntryVinyl({ theme, onOpen }: { theme: InvitationTheme, onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    setOpened(true);
    setTimeout(() => {
      onOpen();
    }, 2000); // long enough for spin and zoom
  };

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 delay-500 ${opened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: theme.primary }}>
      <div className="relative w-64 h-64 cursor-pointer" onClick={handleClick}>
         {/* Vinyl */}
         <div className="absolute inset-1 rounded-full shadow-2xl flex items-center justify-center" style={{
            backgroundColor: "#111",
            backgroundImage: "repeating-radial-gradient(circle, #111, #111 2px, #222 3px, #111 4px)",
            animation: opened ? "vinyl-spin 2s ease-in forwards" : "none"
         }}>
             {/* Label */}
             <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                <div className="w-4 h-4 rounded-full bg-white"></div>
             </div>
         </div>
         
         {/* Sleeve */}
         <div className="absolute inset-0 shadow-2xl flex items-center justify-center transition-all duration-1000 z-10" style={{
            backgroundColor: theme.paper,
            opacity: opened ? 0 : 1,
            borderRight: `4px solid ${theme.accent}`
         }}>
            <div className="w-[90%] h-[90%] border-2 flex items-center justify-center text-center p-4" style={{ borderColor: theme.primary }}>
               <span className="font-display italic text-2xl" style={{ color: theme.primary }}>Celebración</span>
            </div>
         </div>
      </div>
      {!opened && (
        <p className="absolute bottom-1/4 font-body text-xs tracking-widest text-white/50 uppercase">Toca para abrir</p>
      )}
    </div>
  );
}
