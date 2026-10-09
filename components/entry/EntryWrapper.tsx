"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { EntryAnimation, InvitationTheme } from "@/lib/mock-data";
import EntryEnvelope from "./EntryEnvelope";
import EntryDisc from "./EntryDisc";
import EntryVinyl from "./EntryVinyl";

export default function EntryWrapper({ 
  animation, 
  theme,
  onAnimationOpen,
  children
}: { 
  animation: EntryAnimation;
  theme: InvitationTheme;
  onAnimationOpen?: () => void;
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(animation === "none");
  const [showAnimation, setShowAnimation] = useState(animation !== "none");

  useEffect(() => {
    // Reset if animation type changes in designer
    if (animation === "none") {
      setOpened(true);
      setShowAnimation(false);
      // If there's no animation, signal immediately
      onAnimationOpen?.();
    } else {
      setOpened(false);
      setShowAnimation(true);
    }
  }, [animation]);

  const handleOpen = () => {
    setOpened(true);
    onAnimationOpen?.();
    setTimeout(() => {
      setShowAnimation(false);
    }, 1000);
  };

  return (
    <div className="relative w-full min-h-full">
      {showAnimation && (
        <div className="absolute inset-0 z-50 overflow-hidden">
           {animation === "carta" && <EntryEnvelope theme={theme} onOpen={handleOpen} />}
           {animation === "disco" && <EntryDisc theme={theme} onOpen={handleOpen} />}
           {animation === "vinilo" && <EntryVinyl theme={theme} onOpen={handleOpen} />}
        </div>
      )}
      <motion.div
        className="relative w-full"
        initial={animation !== "none" ? { opacity: 0 } : { opacity: 1 }}
        animate={opened ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={!opened ? { maxHeight: "100vh", overflow: "hidden" } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
