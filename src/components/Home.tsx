import { SmartCard } from "./SmartCard";
import { QuickActions } from "./QuickActions";
import { RecentTransactions } from "./RecentTransactions";
import { TransferModal } from "./TransferModal";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

interface HomeProps {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  createTransaction: (
    type: "sent" | "received" | "recurring",
    recipient: string,
    amount: number,
    method: string
  ) => Promise<void>;
  refreshData: () => Promise<void>;
  onNavigateToStats: (type: "monthly" | "daily") => void;
  onQuickAction: (type: "local" | "international" | "payin") => void;
  showTransferModal: boolean;
  transferType: "local" | "international" | "payin";
  onCloseTransferModal: () => void;
  onTransactionClick: (transaction: Transaction) => void;
  onViewAllTransactions: () => void;
}

export function Home({
  balance,
  transactions,
  loading,
  createTransaction,
  refreshData,
  onNavigateToStats,
  onQuickAction,
  showTransferModal,
  transferType,
  onCloseTransferModal,
  onTransactionClick,
  onViewAllTransactions,
}: HomeProps) {
  const handleTransactionComplete = async (
    recipient: string,
    amount: number,
    method: string
  ) => {
    const type = transferType === "payin" ? "received" : "sent";
    try {
      await createTransaction(type, recipient, amount, method);
      // Trigger balance recalculation after transaction is created
      await refreshData();
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-slate-900">Kola Wallet</h1>
          <p className="text-slate-500 text-sm">Good morning, Alex</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>

      {/* Smart Card */}
      <SmartCard
        balance={balance}
        loading={loading}
        transactions={transactions}
        onNavigateToStats={onNavigateToStats}
      />

      {/* Quick Actions */}
      <QuickActions onAction={onQuickAction} />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={transactions}
        loading={loading}
        onTransactionClick={onTransactionClick}
        onViewAllTransactions={onViewAllTransactions}
      />

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          type={transferType}
          onClose={onCloseTransferModal}
          onComplete={handleTransactionComplete}
        />
      )}
    </div>
  );
}
