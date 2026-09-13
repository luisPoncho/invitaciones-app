import type { InvitationTheme, StylePreset } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";
import { LeafDivider } from "./Ornaments";

interface SeparadorProps {
  theme?: InvitationTheme;
  stylePreset?: StylePreset;
  bgColor?: string;
}

export default function Separador({ theme, stylePreset = "clasico", bgColor }: SeparadorProps) {
  const t = { ...defaultTheme, ...theme };
  const isRomantico = stylePreset === "romantico";

  if (isRomantico) {
    return (
      <section style={{ backgroundColor: bgColor || t.paper || "transparent" }} className="py-8 flex justify-center items-center w-full">
        <LeafDivider color={t.accent} />
      </section>
    );
  }

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
