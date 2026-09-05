"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const PRESETS = [
  // Botánico (original)
  ["#22342A", "#182620", "#F4EFE4", "#B08D3F", "#D9C48B"],
  // Azul marino
  ["#1B2A4A", "#121E35", "#F0F4FF", "#4A90D9", "#93C5FD"],
  // Rosa nude
  ["#5C3D3D", "#3D2424", "#FDF5F0", "#C47C5A", "#E8B89A"],
  // Lila
  ["#2D1B69", "#1A0F45", "#FAF0FF", "#9B59B6", "#C39BD3"],
  // Terracota
  ["#4A2010", "#2E1008", "#FFF8F4", "#C0522A", "#E08060"],
];

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Swatch nativo */}
        <div className="relative w-9 h-9 rounded-lg overflow-hidden ring-1 ring-white/20 flex-shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full rounded-lg pointer-events-none"
            style={{ backgroundColor: value }}
          />
        </div>
        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white/30 transition-colors"
          maxLength={7}
        />
      </div>
    </div>
  );
}
