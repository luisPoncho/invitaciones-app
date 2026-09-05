"use client";
import { useState, useEffect } from "react";
import type { EntryAnimation, InvitationTheme } from "@/lib/mock-data";
import EntryEnvelope from "./EntryEnvelope";
import EntryDisc from "./EntryDisc";
import EntryVinyl from "./EntryVinyl";

export default function EntryWrapper({ 
  animation, 
  theme,
  children
}: { 
  animation: EntryAnimation;
  theme: InvitationTheme;
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(animation === "none");
  const [showAnimation, setShowAnimation] = useState(animation !== "none");

  useEffect(() => {
    // Reset if animation type changes in designer
    if (animation === "none") {
      setOpened(true);
      setShowAnimation(false);
    } else {
      setOpened(false);
      setShowAnimation(true);
    }
  }, [animation]);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 1000);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {showAnimation && (
        <div className="absolute inset-0 z-50 overflow-hidden">
           {animation === "carta" && <EntryEnvelope theme={theme} onOpen={handleOpen} />}
           {animation === "disco" && <EntryDisc theme={theme} onOpen={handleOpen} />}
           {animation === "vinilo" && <EntryVinyl theme={theme} onOpen={handleOpen} />}
        </div>
      )}
      <div className={`relative w-full flex-1 transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0 max-h-screen overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
}
