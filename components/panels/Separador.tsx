import type { InvitationTheme } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";

interface SeparadorProps {
  theme?: InvitationTheme;
  bgColor?: string; // Optional override for background
}

export default function Separador({ theme, bgColor }: SeparadorProps) {
  const t = { ...defaultTheme, ...theme };
  
  return (
    <section style={{ backgroundColor: bgColor || 'transparent' }} className="py-12 flex justify-center items-center w-full">
      <svg width="140" height="28" viewBox="0 0 140 28" fill="none" aria-hidden="true">
        <path d="M0 14 H55" stroke={t.accent} strokeWidth="1" />
        <path d="M85 14 H140" stroke={t.accent} strokeWidth="1" />
        <path
          d="M70 14 C70 6, 62 4, 58 8 C62 10, 64 6, 70 14 C70 6, 78 4, 82 8 C78 10, 76 6, 70 14"
          fill={t.accent}
        />
        <circle cx="70" cy="14" r="2.5" fill={t.accent} />
      </svg>
    </section>
  );
}
