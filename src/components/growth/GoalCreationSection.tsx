import { CreateGoalPage } from "../CreateGoalPage";

interface GoalCreationSectionProps {
  onCreate: (payload: {
    name: string;
    target: number;
    color: string;
    icon: string;
    template?: string;
    locked?: boolean;
    penaltyRate?: number;
    boostRate?: number;
  }) => Promise<void>;
  onClose: () => void;
}

export function GoalCreationSection({
  onCreate,
  onClose,
}: GoalCreationSectionProps) {
  return <CreateGoalPage onCreate={onCreate} onClose={onClose} />;
}
