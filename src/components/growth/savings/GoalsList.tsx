import React from "react";
import type { Goal, GoalActionsProps } from "./types";
import { GoalCard } from "./GoalCard";

interface GoalsListProps {
  goals: Goal[];
  onOpenFundsModal: GoalActionsProps["onOpenFundsModal"];
  onGoalClick: (goalId: string) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  onOpenFundsModal,
  onGoalClick,
}) => {
  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onGoalClick={() => onGoalClick(goal.id)}
          onOpenFundsModal={onOpenFundsModal}
        />
      ))}
    </div>
  );
};
