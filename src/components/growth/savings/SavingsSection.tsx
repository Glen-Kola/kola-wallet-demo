import React from "react";
import type { SavingsSectionProps } from "./types";
import { TotalSavingsCard } from "./TotalSavingsCard";
import { GoalsHeader } from "./GoalsHeader";
import { EmptySavingsState } from "./EmptySavingsState";
import { GoalsList } from "./GoalsList";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const SavingsSection: React.FC<SavingsSectionProps> = ({
  goals,
  loading,
  onOpenFundsModal,
  onAddGoal,
  setSelectedGoal,
  setActiveSection,
}) => {
  const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(goalId);
    setActiveSection("goalDetails");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <TotalSavingsCard totalSavings={totalSavings} onAddGoal={onAddGoal} />
      <GoalsHeader onAddGoal={onAddGoal} />
      {goals.length === 0 ? (
        <EmptySavingsState onAddGoal={onAddGoal} />
      ) : (
        <GoalsList
          goals={goals}
          onOpenFundsModal={onOpenFundsModal}
          onGoalClick={handleGoalClick}
        />
      )}
    </div>
  );
};
