"use client";

import { motion } from "framer-motion";

export type ColorBendsPreset = "hero" | "warm" | "cool" | "conversion";

const presets: Record<ColorBendsPreset, { colors: string[] }> = {
  hero: { colors: ["#0E0C0A", "#C9A96E22", "#7A5C3C44", "#3D2B1F55"] },
  warm: { colors: ["#0E0C0A", "#3D2B1F", "#C9A96E22", "#7A5C3C"] },
  cool: { colors: ["#0E0C0A", "#1A1714", "#2C2520", "#C9A96E11"] },
  conversion: { colors: ["#3D2B1F", "#C9A96E33", "#7A5C3C", "#0E0C0A"] },
};

type Props = {
  preset?: ColorBendsPreset;
  intensity?: number;
  className?: string;
};

/**
 * Brand background wrapper intended to be used with an overlay on top
 * (see spec: always layer `bg-obsidian/...` above to ensure readability).
 */
export default function ColorBends({
  preset = "cool",
  intensity = 1,
  className = "",
}: Props) {
  const colors = presets[preset].colors;

  // Use multiple radial gradients to mimic "color bends" while keeping it subtle/dark.
  const bg = `
    radial-gradient(circle at 15% 20%, ${colors[1]} 0%, transparent 55%),
    radial-gradient(circle at 75% 25%, ${colors[2]} 0%, transparent 60%),
    radial-gradient(circle at 35% 85%, ${colors[3]} 0%, transparent 55%)
  `;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: bg,
          opacity: 0.85 * intensity,
          filter: "blur(28px) saturate(1.05)",
          transformOrigin: "center",
        }}
        animate={{
          x: ["-6%", "6%"],
          y: ["5%", "-5%"],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

