import React from "react";
import { Sparkles } from "lucide-react";
import type { Goal } from "./types";
import { GoalIcon } from "./GoalIcon";
import { GoalInfo } from "./GoalInfo";
import { getProgressPercentage } from "./constants";

interface GoalCardHeaderProps {
  goal: Goal;
}

export const GoalCardHeader: React.FC<GoalCardHeaderProps> = ({ goal }) => {
  const boostRate = Math.min(goal.boostRate || 0, 0.05);
  const progress = getProgressPercentage(goal.current, goal.target, boostRate);

  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <GoalIcon icon={goal.icon} color={goal.color} />
        <GoalInfo goal={goal} />
      </div>
      <div className="text-right text-slate-600 text-sm">
        <span className="block">{progress.toFixed(0)}%</span>
        {boostRate > 0 && (
          <span className="text-emerald-600 text-xs flex items-center justify-end gap-1">
            <Sparkles className="w-3 h-3" /> +{(boostRate * 100).toFixed(1)}%
            boost
          </span>
        )}
      </div>
    </div>
  );
};
