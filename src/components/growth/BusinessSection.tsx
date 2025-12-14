import { Building2 } from "lucide-react";

interface BusinessSectionProps {
  organizations: any[];
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

export function BusinessSection({
  organizations,
  loading,
  onOpenFundsModal,
}: BusinessSectionProps) {
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
      {/* Create Organization CTA */}
      <div
        className="bg-gradient-to-br rounded-3xl p-6 text-white"
        style={{
          backgroundColor: "#543c52",
        }}
      >
        <h3 className="text-white mb-2">Business & Communities</h3>
        <p className="text-amber-100 text-sm mb-4">
          Organize funds for causes and teams
        </p>
        <button
          className="bg-white text-primary-600 px-6 py-2 rounded-xl text-sm transition-colors"
          style={{
            color: "#543c52",
          }}
        >
          Create Organization
        </button>
      </div>

      {/* Active Organizations */}
      <h3 className="text-slate-900">Your Organizations</h3>

      {organizations.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">No organizations yet</p>
          <button className="mt-4 text-amber-600 text-sm">
            Create your first one
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-slate-900">{org.name}</p>
                    <p className="text-slate-500 text-sm">
                      {org.members} contributors
                    </p>
                  </div>
                </div>
                <div className="text-right text-slate-600 text-sm">
                  <span className="block">${org.balance.toLocaleString()}</span>
                  <span className="text-xs">Balance</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() =>
                    onOpenFundsModal(
                      "deposit",
                      "organization",
                      org.name,
                      org.id,
                      org.balance
                    )
                  }
                  className="flex-1 bg-amber-100 text-amber-800 py-2 rounded-xl text-sm hover:bg-amber-200 transition-colors"
                >
                  Deposit
                </button>
                <button
                  onClick={() =>
                    onOpenFundsModal(
                      "withdraw",
                      "organization",
                      org.name,
                      org.id,
                      org.balance
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
