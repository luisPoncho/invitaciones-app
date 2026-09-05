interface DividerProps {
  accentColor?: string;
}

export default function Divider({ accentColor = "#B08D3F" }: DividerProps) {
  return (
    <div className="flex justify-center py-6" aria-hidden="true">
      <svg width="140" height="28" viewBox="0 0 140 28" fill="none">
        <path d="M0 14 H55" stroke={accentColor} strokeWidth="1" />
        <path d="M85 14 H140" stroke={accentColor} strokeWidth="1" />
        <path
          d="M70 14 C70 6, 62 4, 58 8 C62 10, 64 6, 70 14 C70 6, 78 4, 82 8 C78 10, 76 6, 70 14"
          fill={accentColor}
        />
        <circle cx="70" cy="14" r="2.5" fill={accentColor} />
      </svg>
    </div>
  );
}
