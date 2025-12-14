import React from "react";
import type { EmptySavingsStateProps } from "./types";

export const EmptySavingsState: React.FC<EmptySavingsStateProps> = ({
  onAddGoal,
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
      <p className="text-slate-500">No savings goals yet</p>
      <button
        onClick={onAddGoal}
        className="mt-4 text-emerald-600 text-sm hover:text-emerald-700"
      >
        Create your first goal
      </button>
    </div>
  );
};
