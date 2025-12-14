import React from "react";
import { AlertTriangle } from "lucide-react";

interface PenaltyWarningProps {
  penaltyRate?: number;
}

export const PenaltyWarning: React.FC<PenaltyWarningProps> = ({
  penaltyRate,
}) => {
  if (!penaltyRate || penaltyRate === 0) return null;

  return (
    <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
      <AlertTriangle className="w-3 h-3 text-amber-500" />
      Emergency withdrawals incur {(penaltyRate * 100).toFixed(1)}% penalty to
      discourage misuse.
    </p>
  );
};
