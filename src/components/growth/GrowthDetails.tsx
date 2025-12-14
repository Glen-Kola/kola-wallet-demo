import {
  ArrowLeft,
  Sparkles,
  Lock,
  AlertTriangle,
  Target as TargetIcon,
  ShieldCheck,
  Plane,
  Home,
  GraduationCap,
  CarFront,
  Heart,
  Briefcase,
  BookOpen,
  PiggyBank,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type IconComponent = (props: { className?: string }) => JSX.Element;

const iconMap: Record<string, IconComponent> = {
  leaf: TargetIcon,
  shield: ShieldCheck,
  plane: Plane,
  home: Home,
  grad: GraduationCap,
  car: CarFront,
  heart: Heart,
  briefcase: Briefcase,
  target: TargetIcon,
  book: BookOpen,
  piggy: PiggyBank,
};

const isHexColor = (val: string) => val?.startsWith("#");

// Color mapping for static class names
const colorClassMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  teal: { bg: "bg-teal-100", text: "text-teal-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
};

const colorProgressMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
};

export function GoalDetails({
  goal,
  onBack,
  onOpenFundsModal,
}: {
  goal: any;
  onBack: () => void;
  onOpenFundsModal: (
    type: "deposit" | "withdraw" | "emergency",
    targetType: "savings" | "group" | "organization",
    targetName: string,
    targetId: string,
    currentBalance: number,
    maxWithdraw?: number,
    penaltyRate?: number
  ) => void;
}) {
  const [creditScore, setCreditScore] = useState<{ score: number } | null>(
    null
  );

  const baseProgress = (goal.current / goal.target) * 100;
  const boostRate = Math.min(goal.boostRate || 0, 0.05);
  const progress = Math.min(baseProgress * (1 + boostRate), 110);
  const isHex = isHexColor(goal.color);
  const accentColor = isHex ? goal.color : undefined;
  const colorKey = isHex ? "emerald" : goal.color || "emerald";
  const IconComp = iconMap[goal.icon] || TargetIcon;
  const colorClasses = colorClassMap[colorKey] || colorClassMap.emerald;
  const progressClass = colorProgressMap[colorKey] || colorProgressMap.emerald;

  useEffect(() => {
    let cancelled = false;
    async function fetchScore() {
      try {
        const res = await fetch(
          "/functions/v1/make-server-c5964f01/credit-score",
          { headers: { "X-User-Id": "demo-user" } }
        );
        const data = await res.json();
        if (!cancelled) setCreditScore(data);
      } catch {
        // ignore
      }
    }
    fetchScore();
    return () => {
      cancelled = true;
    };
  }, []);

  const projectedMonthsToTarget = useMemo(() => {
    const fallback = Math.max(goal.target * 0.02, 50);
    const monthly = goal.lastMonthlyDeposit || fallback;
    const remaining = Math.max(goal.target - goal.current, 0);
    return monthly > 0 ? Math.ceil(remaining / monthly) : null;
  }, [goal]);

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-slate-900">Goal Details</h1>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isHex ? "bg-slate-100" : colorClasses.bg
              }`}
              style={isHex ? { backgroundColor: accentColor } : undefined}
            >
              <IconComp
                className={`w-6 h-6 ${
                  isHex ? "text-white" : colorClasses.text
                }`}
                style={isHex ? { color: "#ffffff" } : undefined}
              />
            </div>
            <div>
              <p className="text-slate-900 flex items-center gap-2">
                {goal.name}
                {goal.locked && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </p>
              <p className="text-slate-500 text-sm">
                ${goal.current.toLocaleString()} of $
                {goal.target.toLocaleString()}
              </p>
              {goal.template && (
                <p className="text-slate-400 text-xs mt-1">
                  Template: {goal.template}
                </p>
              )}
            </div>
          </div>
          <div className="text-right text-slate-600 text-sm">
            <span className="block">{progress.toFixed(0)}%</span>
            {boostRate > 0 && (
              <span className="text-emerald-600 text-xs flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3" /> +{(boostRate * 100).toFixed(1)}
                % boost
              </span>
            )}
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all ${
              isHex ? "" : progressClass
            }`}
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-500 text-sm">Duration</p>
            <p className="text-slate-900">
              {goal.duration ? `${goal.duration} days` : "—"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-500 text-sm">Rates</p>
            <p className="text-slate-900">
              Penalty:{" "}
              {goal.penaltyRate ? (goal.penaltyRate * 100).toFixed(1) : 0}% •
              Boost: {(boostRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-500 text-sm">Projection</p>
            <p className="text-slate-900">
              {projectedMonthsToTarget
                ? `${projectedMonthsToTarget} months to reach target`
                : "Add deposits to see a projection"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-500 text-sm">Credit Score</p>
            <p className="text-slate-900">
              {creditScore ? creditScore.score : "Loading..."}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Consistent deposits and locked goals improve savings behavior.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() =>
              onOpenFundsModal(
                "deposit",
                "savings",
                goal.name,
                goal.id,
                goal.current
              )
            }
            className="flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-xl text-sm hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1"
          >
            Deposit
          </button>
          {goal.locked ? (
            <button
              onClick={() =>
                onOpenFundsModal(
                  "emergency",
                  "savings",
                  goal.name,
                  goal.id,
                  goal.current,
                  goal.current,
                  goal.penaltyRate
                )
              }
              disabled={goal.current === 0}
              className="flex-1 bg-amber-100 text-amber-800 py-2 rounded-xl text-sm hover:bg-amber-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency withdraw
            </button>
          ) : (
            <button
              onClick={() =>
                onOpenFundsModal(
                  "withdraw",
                  "savings",
                  goal.name,
                  goal.id,
                  goal.current,
                  goal.current
                )
              }
              disabled={goal.current === 0}
              className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
