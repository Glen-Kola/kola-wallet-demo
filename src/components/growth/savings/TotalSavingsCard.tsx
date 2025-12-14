import React from "react";
import { TrendingUp, Plus } from "lucide-react";
import type { TotalSavingsCardProps } from "./types";

export const TotalSavingsCard: React.FC<TotalSavingsCardProps> = ({
  totalSavings,
  onAddGoal,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white">
      <p className="text-emerald-100 text-sm mb-1">Total Savings</p>
      <h2 className="text-white mb-4">${totalSavings.toFixed(2)}</h2>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm">Building your future</span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={onAddGoal}
          className="w-50 h-70 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors p-4"
        >
          <Plus className="w-5 h-5 text-emerald-500" />
          <span className="block text-emerald-700">Create a New Goal</span>
        </button>
      </div>
    </div>
  );
};
