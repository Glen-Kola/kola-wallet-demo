import { useState } from "react";
import { Users, Plus, Building2 } from "lucide-react";
import { CreateGroupModal } from "./modals/CreateGroupModal";
import { CollectorManagementModal } from "./modals/CollectorManagementModal";
import { ManualCollectionModal } from "./modals/ManualCollectionModal";

interface GroupsSectionProps {
  groups: any[];
  loading: boolean;
  userRole?: "microfinance" | "user";
  onOpenFundsModal: (
    type: "deposit" | "withdraw" | "emergency",
    targetType: "savings" | "group" | "organization",
    targetName: string,
    targetId: string,
    currentBalance: number,
    maxWithdraw?: number,
    penaltyRate?: number
  ) => void;
  onCreateGroup?: (data: {
    name: string;
    description?: string;
    isOrganizationGroup?: boolean;
  }) => Promise<void>;
  onAddCollector?: (
    groupId: string,
    data: {
      name: string;
      email: string;
      role: string;
    }
  ) => Promise<void>;
  onRemoveCollector?: (groupId: string, collectorId: string) => Promise<void>;
  onRegisterCollection?: (
    groupId: string,
    collectorId: string,
    data: {
      amount: number;
      description?: string;
      collectionDate?: string;
    }
  ) => Promise<void>;
}

export function GroupsSection({
  groups,
  loading,
  userRole = "user",
  onOpenFundsModal,
  onCreateGroup,
  onAddCollector,
  onRemoveCollector,
  onRegisterCollection,
}: GroupsSectionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupForCollector, setSelectedGroupForCollector] = useState<
    string | null
  >(null);
  const [selectedGroupForCollection, setSelectedGroupForCollection] = useState<
    string | null
  >(null);
  const [selectedCollectorForCollection, setSelectedCollectorForCollection] =
    useState<string | null>(null);

  const handleCreateGroup = async (data: {
    name: string;
    description?: string;
    isOrganizationGroup?: boolean;
  }) => {
    if (onCreateGroup) {
      await onCreateGroup(data);
    } else {
      console.log("Creating group:", data);
    }
  };

  const handleAddCollector = async (data: {
    name: string;
    email: string;
    role: string;
  }) => {
    if (selectedGroupForCollector && onAddCollector) {
      await onAddCollector(selectedGroupForCollector, data);
    }
  };

  const handleRemoveCollector = async (collectorId: string) => {
    if (selectedGroupForCollector && onRemoveCollector) {
      await onRemoveCollector(selectedGroupForCollector, collectorId);
    }
  };

  const handleRegisterCollection = async (data: {
    amount: number;
    description?: string;
    collectionDate?: string;
  }) => {
    if (
      selectedGroupForCollection &&
      selectedCollectorForCollection &&
      onRegisterCollection
    ) {
      await onRegisterCollection(
        selectedGroupForCollection,
        selectedCollectorForCollection,
        data
      );
    }
  };

  const getGroupCollectors = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    return group?.collectors || [];
  };
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
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-white mb-2">Start a Savings Group</h3>
        <p className="text-blue-100 text-sm mb-4">
          Pool funds with friends and family
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-blue-600 px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Create Group
        </button>
      </div>

      {/* Active Groups */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900">Your Groups</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">No active groups yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-emerald-600 text-sm font-medium hover:text-emerald-700"
          >
            Create your first group
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center relative">
                    <Users className="w-6 h-6 text-blue-600" />
                    {group.isOrganizationGroup && (
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center"
                        title="Organization Group"
                      >
                        <Building2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-900 font-medium">{group.name}</p>
                      {group.isOrganizationGroup && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">
                          Organization Group
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm">
                      {group.members} members{" "}
                      {group.collectors &&
                        `• ${group.collectors.length} collectors`}
                    </p>
                  </div>
                </div>
                <div className="text-right text-slate-600 text-sm">
                  <span className="block font-semibold">
                    ${group.balance.toLocaleString()}
                  </span>
                  <span className="text-xs">Balance</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 flex-wrap">
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
                  className="flex-1 min-w-[100px] bg-blue-100 text-blue-700 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors"
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
                  className="flex-1 min-w-[100px] bg-slate-100 text-slate-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Withdraw
                </button>
                {group.isOrganizationGroup && (
                  <>
                    <button
                      onClick={() => setSelectedGroupForCollector(group.id)}
                      className="flex-1 min-w-[120px] bg-purple-100 text-purple-700 py-2 rounded-xl text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      Collectors
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGroupForCollection(group.id);
                        if (group.collectors?.[0]) {
                          setSelectedCollectorForCollection(
                            group.collectors[0].id
                          );
                        }
                      }}
                      disabled={
                        !group.collectors || group.collectors.length === 0
                      }
                      className="flex-1 min-w-[140px] bg-emerald-100 text-emerald-700 py-2 rounded-xl text-sm font-medium hover:bg-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Collection
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
        userRole={userRole}
      />

      {/* Collector Management Modal */}
      {selectedGroupForCollector && (
        <CollectorManagementModal
          open={true}
          onClose={() => setSelectedGroupForCollector(null)}
          groupName={
            groups.find((g) => g.id === selectedGroupForCollector)?.name || ""
          }
          groupId={selectedGroupForCollector}
          collectors={getGroupCollectors(selectedGroupForCollector)}
          onAddCollector={handleAddCollector}
          onRemoveCollector={handleRemoveCollector}
        />
      )}

      {/* Manual Collection Modal */}
      {selectedGroupForCollection && selectedCollectorForCollection && (
        <ManualCollectionModal
          open={true}
          onClose={() => {
            setSelectedGroupForCollection(null);
            setSelectedCollectorForCollection(null);
          }}
          groupName={
            groups.find((g) => g.id === selectedGroupForCollection)?.name || ""
          }
          groupId={selectedGroupForCollection}
          collectorName={
            getGroupCollectors(selectedGroupForCollection).find(
              (c: any) => c.id === selectedCollectorForCollection
            )?.name || ""
          }
          collectorId={selectedCollectorForCollection}
          onRegisterCollection={handleRegisterCollection}
        />
      )}
    </div>
  );
}
