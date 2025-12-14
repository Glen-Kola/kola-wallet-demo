import React from "react";
import { Lock } from "lucide-react";
import type { Goal } from "./types";

interface GoalInfoProps {
  goal: Goal;
}

export const GoalInfo: React.FC<GoalInfoProps> = ({ goal }) => {
  return (
    <div>
      <p className="text-slate-900 flex items-center gap-2">
        {goal.name}
        {goal.locked && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </p>
      <p className="text-slate-500 text-sm">
        ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
      </p>
    </div>
  );
};
