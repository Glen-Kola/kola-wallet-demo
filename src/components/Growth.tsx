import { useState } from "react";
import { useKolaWallet } from "../hooks/useKolaWallet";
import { FundsModal } from "./FundsModal";
import { SavingsSection } from "./growth/SavingsSection";
import { GroupsSection } from "./growth/GroupsSection";
import { BusinessSection } from "./growth/BusinessSection";
import { GoalCreationSection } from "./growth/GoalCreationSection";
import { GoalDetails } from "./growth/GrowthDetails";

export function Growth() {
  const {
    savingsGoals,
    groups,
    organizations,
    loading,
    createSavingsGoal,
    depositToSavings,
    withdrawFromSavings,
    emergencyWithdrawFromSavings,
    depositToGroup,
    withdrawFromGroup,
    depositToOrganization,
    withdrawFromOrganization,
  } = useKolaWallet();
  const [activeSection, setActiveSection] = useState<
    "savings" | "groups" | "business" | "goalCreation" | "goalDetails"
  >("savings");
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [fundsModalConfig, setFundsModalConfig] = useState<{
    type: "deposit" | "withdraw" | "emergency";
    targetType: "savings" | "group" | "organization";
    targetName: string;
    targetId: string;
    currentBalance: number;
    maxWithdraw?: number;
    penaltyRate?: number;
  } | null>(null);
  const [selectedGoal, setSelectedGoal] = useState("1");

  const handleOpenFundsModal = (
    type: "deposit" | "withdraw" | "emergency",
    targetType: "savings" | "group" | "organization",
    targetName: string,
    targetId: string,
    currentBalance: number,
    maxWithdraw?: number,
    penaltyRate?: number
  ) => {
    setFundsModalConfig({
      type,
      targetType,
      targetName,
      targetId,
      currentBalance,
      maxWithdraw,
      penaltyRate,
    });
    setShowFundsModal(true);
  };

  const handleFundsComplete = async (amount: number) => {
    if (!fundsModalConfig) return;

    const { type, targetType, targetId } = fundsModalConfig;

    if (targetType === "savings") {
      if (type === "deposit") {
        await depositToSavings(targetId, amount);
      } else if (type === "emergency") {
        await emergencyWithdrawFromSavings(targetId, amount);
      } else {
        await withdrawFromSavings(targetId, amount);
      }
    } else if (targetType === "group") {
      if (type === "deposit") {
        await depositToGroup(targetId, amount);
      } else {
        await withdrawFromGroup(targetId, amount);
      }
    } else if (targetType === "organization") {
      if (type === "deposit") {
        await depositToOrganization(targetId, amount);
      } else {
        await withdrawFromOrganization(targetId, amount);
      }
    }
  };

  const handleCreateGoal = async (payload: {
    name: string;
    target: number;
    color: string;
    icon: string;
    template?: string;
    locked?: boolean;
    penaltyRate?: number;
    boostRate?: number;
  }) => {
    await createSavingsGoal(payload);
    setActiveSection("savings");
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-slate-900">Growth Hub</h1>
        <p className="text-slate-500 text-sm">Savings, Groups & Business</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 bg-slate-100 rounded-2xl p-1">
        <button
          onClick={() => setActiveSection("savings")}
          className={`flex-1 py-2 px-4 rounded-xl text-sm transition-all ${
            ["savings", "goalCreation", "goalDetails"].includes(activeSection)
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600"
          }`}
        >
          Savings
        </button>
        <button
          onClick={() => setActiveSection("groups")}
          className={`flex-1 py-2 px-4 rounded-xl text-sm transition-all ${
            activeSection === "groups"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600"
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => setActiveSection("business")}
          className={`flex-1 py-2 px-4 rounded-xl text-sm transition-all ${
            activeSection === "business"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600"
          }`}
        >
          Business
        </button>
      </div>

      {/* Content */}
      {activeSection === "savings" && (
        <SavingsSection
          goals={savingsGoals}
          loading={loading}
          onOpenFundsModal={handleOpenFundsModal}
          onAddGoal={() => setActiveSection("goalCreation")}
          setSelectedGoal={setSelectedGoal}
          setActiveSection={setActiveSection}
        />
      )}
      {activeSection === "groups" && (
        <GroupsSection
          groups={groups}
          loading={loading}
          onOpenFundsModal={handleOpenFundsModal}
        />
      )}
      {activeSection === "business" && (
        <BusinessSection
          organizations={organizations}
          loading={loading}
          onOpenFundsModal={handleOpenFundsModal}
        />
      )}
      {activeSection === "goalCreation" && (
        <GoalCreationSection
          onClose={() => setActiveSection("savings")}
          onCreate={handleCreateGoal}
        />
      )}
      {activeSection === "goalDetails" && (
        <GoalDetails
          goal={savingsGoals.find((g) => g.id === selectedGoal)!}
          onBack={() => setActiveSection("savings")}
          onOpenFundsModal={handleOpenFundsModal}
        />
      )}

      {/* Funds Modal */}
      {showFundsModal && fundsModalConfig && (
        <FundsModal
          {...fundsModalConfig}
          onClose={() => setShowFundsModal(false)}
          onComplete={handleFundsComplete}
        />
      )}
    </div>
  );
}
