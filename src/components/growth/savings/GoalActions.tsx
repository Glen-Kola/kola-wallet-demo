import React from "react";
import { ArrowDownLeft, ArrowUpRight, AlertTriangle } from "lucide-react";
import type { GoalActionsProps } from "./types";

export const GoalActions: React.FC<GoalActionsProps> = ({
  goal,
  onOpenFundsModal,
}) => {
  const handleDeposit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFundsModal("deposit", "savings", goal.name, goal.id, goal.current);
  };

  const handleEmergencyWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFundsModal(
      "emergency",
      "savings",
      goal.name,
      goal.id,
      goal.current,
      goal.current,
      goal.penaltyRate
    );
  };

  const handleWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFundsModal(
      "withdraw",
      "savings",
      goal.name,
      goal.id,
      goal.current,
      goal.current
    );
  };

  return (
    <div className="flex gap-2 pt-3 border-t border-slate-100">
      <button
        onClick={handleDeposit}
        className="flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-xl text-sm hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1"
      >
        <ArrowDownLeft className="w-4 h-4" />
        Deposit
      </button>
      {goal.locked ? (
        <button
          onClick={handleEmergencyWithdraw}
          disabled={goal.current === 0}
          className="flex-1 bg-amber-100 text-amber-800 py-2 rounded-xl text-sm hover:bg-amber-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AlertTriangle className="w-4 h-4" />
          Emergency withdraw
        </button>
      ) : (
        <button
          onClick={handleWithdraw}
          disabled={goal.current === 0}
          className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpRight className="w-4 h-4" />
          Withdraw
        </button>
      )}
    </div>
  );
};
