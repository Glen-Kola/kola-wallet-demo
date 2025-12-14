import React from "react";
import type { GoalProgressProps } from "./types";
import {
  isHexColor,
  colorProgressMap,
  getProgressPercentage,
} from "./constants";

export const GoalProgressBar: React.FC<GoalProgressProps> = ({
  current,
  target,
  boostRate,
  color,
}) => {
  const isHex = isHexColor(color);
  const accentColor = isHex ? color : undefined;
  const colorKey = isHex ? "emerald" : color || "emerald";
  const progressClass = colorProgressMap[colorKey] || colorProgressMap.emerald;
  const progress = getProgressPercentage(current, target, boostRate);

  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
      <div
        className={`h-2 rounded-full transition-all ${
          isHex ? "" : progressClass
        }`}
        style={{
          width: `${progress}%`,
          backgroundColor: accentColor,
        }}
      />
    </div>
  );
};
