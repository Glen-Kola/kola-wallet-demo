export interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  icon: string;
  color: string;
  locked?: boolean;
  boostRate?: number;
  penaltyRate?: number;
}

export interface SavingsSectionProps {
  goals: Goal[];
  loading: boolean;
  onOpenFundsModal: (
    type: "deposit" | "withdraw" | "emergency",
    targetType: "savings" | "group" | "organization",
    targetName: string,
    targetId: string,
    currentBalance: number,
    maxWithdraw?: number,
    penaltyRate?: number
  ) => void;
  onAddGoal: () => void;
  setSelectedGoal: (id: string) => void;
  setActiveSection: (
    section: "savings" | "groups" | "business" | "goalCreation" | "goalDetails"
  ) => void;
}

export interface TotalSavingsCardProps {
  totalSavings: number;
  onAddGoal: () => void;
}

export interface GoalHeaderProps {
  onAddGoal: () => void;
}

export interface GoalCardProps {
  goal: Goal;
  onGoalClick: () => void;
  onOpenFundsModal: (
    type: "deposit" | "withdraw" | "emergency",
    targetType: "savings" | "group" | "organization",
    targetName: string,
    targetId: string,
    currentBalance: number,
    maxWithdraw?: number,
    penaltyRate?: number
  ) => void;
}

export interface GoalIconProps {
  icon: string;
  color: string;
}

export interface GoalProgressProps {
  current: number;
  target: number;
  boostRate?: number;
  color: string;
}

export interface GoalActionsProps {
  goal: Goal;
  onOpenFundsModal: (
    type: "deposit" | "withdraw" | "emergency",
    targetType: "savings" | "group" | "organization",
    targetName: string,
    targetId: string,
    currentBalance: number,
    maxWithdraw?: number,
    penaltyRate?: number
  ) => void;
}

export interface EmptySavingsStateProps {
  onAddGoal: () => void;
}
