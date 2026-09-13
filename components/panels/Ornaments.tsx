/**
 * Ornaments.tsx — SVG decorative elements for the "romántico" style preset.
 * Includes floral corners, dividers, and border ornaments.
 */

interface OrnamentProps {
  color?: string;
  className?: string;
}

/** Floral corner — mirrored via CSS transform */
export function FloralCorner({ color = "#C4897D", className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Main branch */}
      <path
        d="M5 115 Q30 90 50 70 Q60 55 75 45 Q90 35 110 15"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaves on the branch */}
      <path
        d="M30 90 Q25 80 35 78 Q32 88 30 90Z"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M32 88 Q38 78 28 76 Q30 86 32 88Z"
        fill={color}
        opacity="0.4"
      />
      <path
        d="M50 70 Q44 62 54 58 Q52 68 50 70Z"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M52 68 Q58 58 48 56 Q50 66 52 68Z"
        fill={color}
        opacity="0.45"
      />
      <path
        d="M75 45 Q70 36 80 33 Q78 43 75 45Z"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M77 43 Q83 33 73 31 Q75 41 77 43Z"
        fill={color}
        opacity="0.4"
      />
      {/* Small flower bud */}
      <circle cx="95" cy="25" r="3" fill={color} opacity="0.5" />
      <path
        d="M95 22 Q92 18 95 15 Q98 18 95 22Z"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M92 24 Q88 22 88 18 Q92 20 92 24Z"
        fill={color}
        opacity="0.4"
      />
      <path
        d="M98 24 Q102 22 102 18 Q98 20 98 24Z"
        fill={color}
        opacity="0.4"
      />
      {/* Small dots */}
      <circle cx="20" cy="100" r="1.5" fill={color} opacity="0.3" />
      <circle cx="40" cy="78" r="1.5" fill={color} opacity="0.3" />
      <circle cx="65" cy="52" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/** Floral divider — horizontal with leaves radiating from center */
export function FloralDivider({ color = "#C4897D", className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 300 60"
      fill="none"
      className={className || "w-48 h-10 mx-auto"}
      aria-hidden="true"
    >
      {/* Center flower */}
      <circle cx="150" cy="30" r="4" fill={color} opacity="0.7" />
      <path d="M150 26 Q147 20 150 15 Q153 20 150 26Z" fill={color} opacity="0.5" />
      <path d="M150 34 Q147 40 150 45 Q153 40 150 34Z" fill={color} opacity="0.5" />
      <path d="M146 30 Q140 27 135 30 Q140 33 146 30Z" fill={color} opacity="0.5" />
      <path d="M154 30 Q160 27 165 30 Q160 33 154 30Z" fill={color} opacity="0.5" />
      
      {/* Left branch */}
      <path d="M135 30 Q110 30 80 32 Q50 34 10 30" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M110 30 Q105 24 112 22 Q110 28 110 30Z" fill={color} opacity="0.5" />
      <path d="M108 28 Q113 22 106 20 Q107 26 108 28Z" fill={color} opacity="0.35" />
      <path d="M80 32 Q76 26 83 23 Q82 30 80 32Z" fill={color} opacity="0.5" />
      <path d="M78 30 Q83 24 76 22 Q77 28 78 30Z" fill={color} opacity="0.35" />
      <path d="M50 33 Q47 28 53 25 Q52 31 50 33Z" fill={color} opacity="0.4" />

      {/* Right branch */}
      <path d="M165 30 Q190 30 220 32 Q250 34 290 30" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M190 30 Q195 24 188 22 Q190 28 190 30Z" fill={color} opacity="0.5" />
      <path d="M192 28 Q187 22 194 20 Q193 26 192 28Z" fill={color} opacity="0.35" />
      <path d="M220 32 Q224 26 217 23 Q218 30 220 32Z" fill={color} opacity="0.5" />
      <path d="M222 30 Q217 24 224 22 Q223 28 222 30Z" fill={color} opacity="0.35" />
      <path d="M250 33 Q253 28 247 25 Q248 31 250 33Z" fill={color} opacity="0.4" />

      {/* Small dots */}
      <circle cx="30" cy="31" r="1.2" fill={color} opacity="0.25" />
      <circle cx="270" cy="31" r="1.2" fill={color} opacity="0.25" />
    </svg>
  );
}

/** LeafDivider component alias for elegant spacing */
export function LeafDivider({ color = "#C4897D", className = "" }: OrnamentProps) {
  return (
    <div className={`flex justify-center items-center py-1 ${className}`}>
      <FloralDivider color={color} className="w-44 h-8 max-w-full" />
    </div>
  );
}

/** Frame border — decorative top/bottom line with floral ends */
export function FrameBorder({ color = "#C4897D", className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Main line */}
      <path d="M25 10 H175" stroke={color} strokeWidth="0.8" opacity="0.4" />
      
      {/* Left ornament */}
      <circle cx="20" cy="10" r="2.5" fill={color} opacity="0.5" />
      <path d="M17 10 Q14 7 17 4 Q15 8 17 10Z" fill={color} opacity="0.4" />
      <path d="M17 10 Q14 13 17 16 Q15 12 17 10Z" fill={color} opacity="0.4" />
      
      {/* Right ornament */}
      <circle cx="180" cy="10" r="2.5" fill={color} opacity="0.5" />
      <path d="M183 10 Q186 7 183 4 Q185 8 183 10Z" fill={color} opacity="0.4" />
      <path d="M183 10 Q186 13 183 16 Q185 12 183 10Z" fill={color} opacity="0.4" />
    </svg>
  );
}

/** Small leaf accent */
export function LeafAccent({ color = "#C4897D", className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 10 Q14 4 8 6 Q14 8 20 10 Q14 12 8 14 Q14 16 20 10Z"
        fill={color}
        opacity="0.4"
      />
      <path
        d="M20 10 Q26 4 32 6 Q26 8 20 10 Q26 12 32 14 Q26 16 20 10Z"
        fill={color}
        opacity="0.4"
      />
      <circle cx="20" cy="10" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
}

/** Decorative floral frame — renders 4 corners */
export function FloralFrame({ color = "#C4897D", className = "" }: OrnamentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Top-left */}
      <FloralCorner color={color} className="absolute top-2 left-2 w-16 h-16 sm:w-20 sm:h-20" />
      {/* Top-right */}
      <FloralCorner color={color} className="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 -scale-x-100" />
      {/* Bottom-left */}
      <FloralCorner color={color} className="absolute bottom-2 left-2 w-16 h-16 sm:w-20 sm:h-20 -scale-y-100" />
      {/* Bottom-right */}
      <FloralCorner color={color} className="absolute bottom-2 right-2 w-16 h-16 sm:w-20 sm:h-20 -scale-x-100 -scale-y-100" />
    </div>
  );
}
