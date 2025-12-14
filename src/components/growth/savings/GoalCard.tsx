import React from "react";
import type { GoalCardProps } from "./types";
import { GoalCardHeader } from "./GoalCardHeader";
import { GoalProgressBar } from "./GoalProgressBar";
import { GoalActions } from "./GoalActions";
import { PenaltyWarning } from "./PenaltyWarning";

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onGoalClick,
  onOpenFundsModal,
}) => {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onGoalClick}
    >
      <GoalCardHeader goal={goal} />
      <GoalProgressBar
        current={goal.current}
        target={goal.target}
        boostRate={goal.boostRate}
        color={goal.color}
      />
      <GoalActions goal={goal} onOpenFundsModal={onOpenFundsModal} />
      <PenaltyWarning penaltyRate={goal.penaltyRate} />
    </div>
  );
};
