import React from "react";
import type { GoalIconProps } from "./types";
import { iconMap, isHexColor, colorClassMap } from "./constants";
import { Target as TargetIcon } from "lucide-react";

export const GoalIcon: React.FC<GoalIconProps> = ({ icon, color }) => {
  const isHex = isHexColor(color);
  const accentColor = isHex ? color : undefined;
  const colorKey = isHex ? "emerald" : color || "emerald";
  const IconComp = iconMap[icon] || TargetIcon;
  const colorClasses = colorClassMap[colorKey] || colorClassMap.emerald;

  return (
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
        isHex ? "bg-slate-100" : colorClasses.bg
      }`}
      style={isHex ? { backgroundColor: accentColor } : undefined}
    >
      <IconComp
        className={`w-6 h-6 ${isHex ? "text-white" : colorClasses.text}`}
        style={isHex ? { color: "#ffffff" } : undefined}
      />
    </div>
  );
};
