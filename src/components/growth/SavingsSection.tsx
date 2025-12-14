import {
  Target as TargetIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Plane,
  Home,
  GraduationCap,
  CarFront,
  Heart,
  Briefcase,
  BookOpen,
  PiggyBank,
  Plus,
} from "lucide-react";

interface SavingsSectionProps {
  goals: any[];
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

export function SavingsSection({
  goals,
  loading,
  onOpenFundsModal,
  onAddGoal,
  setSelectedGoal,
  setActiveSection,
}: SavingsSectionProps) {
  const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-slate-200 rounded-3xl h-40 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-2xl h-24 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Savings */}
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
            <Plus className="w-5 h-5 text-emerald-600" />
            <span
              className="block text-black"
              style={{
                color: "black",
              }}
            >
              Create a New Goal
            </span>
          </button>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-900">Your Goals</h3>
        <button
          onClick={onAddGoal}
          className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors"
        >
          <Plus className="w-5 h-5 text-emerald-600" />
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">No savings goals yet</p>
          <button
            onClick={onAddGoal}
            className="mt-4 text-emerald-600 text-sm hover:text-emerald-700"
          >
            Create your first goal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const baseProgress = (goal.current / goal.target) * 100;
            const boostRate = Math.min(goal.boostRate || 0, 0.05);
            const progress = Math.min(baseProgress * (1 + boostRate), 110);
            const isHex = isHexColor(goal.color);
            const accentColor = isHex ? goal.color : undefined;
            const colorKey = isHex ? "emerald" : goal.color || "emerald";
            const IconComp = iconMap[goal.icon] || TargetIcon;
            const colorClasses =
              colorClassMap[colorKey] || colorClassMap.emerald;
            const progressClass =
              colorProgressMap[colorKey] || colorProgressMap.emerald;

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                onClick={() => {
                  setSelectedGoal(goal.id);
                  setActiveSection("goalDetails");
                  console.log("Goal:", goal);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        isHex ? "bg-slate-100" : colorClasses.bg
                      }`}
                      style={
                        isHex ? { backgroundColor: accentColor } : undefined
                      }
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
                    </div>
                  </div>
                  <div className="text-right text-slate-600 text-sm">
                    <span className="block">{progress.toFixed(0)}%</span>
                    {boostRate > 0 && (
                      <span className="text-emerald-600 text-xs flex items-center justify-end gap-1">
                        <Sparkles className="w-3 h-3" /> +
                        {(boostRate * 100).toFixed(1)}% boost
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isHex ? "" : progressClass
                    }`}
                    style={{
                      width: `${progress}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
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
                    <ArrowDownLeft className="w-4 h-4" />
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
                      <ArrowUpRight className="w-4 h-4" />
                      Withdraw
                    </button>
                  )}
                </div>

                {/* Safety note */}
                {goal.penaltyRate !== undefined && goal.penaltyRate > 0 && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Emergency withdrawals incur{" "}
                    {(goal.penaltyRate * 100).toFixed(1)}% penalty to discourage
                    misuse.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
