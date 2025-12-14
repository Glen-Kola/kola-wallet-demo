import { Users, Plus } from "lucide-react";

interface GroupsSectionProps {
  groups: any[];
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
}

export function GroupsSection({
  groups,
  loading,
  onOpenFundsModal,
}: GroupsSectionProps) {
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
      {/* Create Group CTA */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white">
        <h3 className="text-white mb-2">Start a Savings Group</h3>
        <p className="text-blue-100 text-sm mb-4">
          Pool funds with friends and family
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors">
          Create Group
        </button>
      </div>

      {/* Active Groups */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900">Your Groups</h3>
        <button className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">No active groups yet</p>
          <button className="mt-4 text-emerald-600 text-sm">
            Create your first group
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-slate-900">{group.name}</p>
                    <p className="text-slate-500 text-sm">
                      {group.members} members
                    </p>
                  </div>
                </div>
                <div className="text-right text-slate-600 text-sm">
                  <span className="block">
                    ${group.balance.toLocaleString()}
                  </span>
                  <span className="text-xs">Balance</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() =>
                    onOpenFundsModal(
                      "deposit",
                      "group",
                      group.name,
                      group.id,
                      group.balance
                    )
                  }
                  className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-xl text-sm hover:bg-blue-200 transition-colors"
                >
                  Deposit
                </button>
                <button
                  onClick={() =>
                    onOpenFundsModal(
                      "withdraw",
                      "group",
                      group.name,
                      group.id,
                      group.balance
                    )
                  }
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-sm hover:bg-slate-200 transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
