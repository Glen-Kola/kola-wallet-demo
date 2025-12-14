import React from "react";
import type { GoalHeaderProps } from "./types";
import { Plus } from "lucide-react";

export const GoalsHeader: React.FC<GoalHeaderProps> = ({ onAddGoal }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-slate-900">Your Goals</h3>
      <button
        onClick={onAddGoal}
        className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors"
      >
        <Plus className="w-5 h-5 text-emerald-600" />
      </button>
    </div>
  );
};
