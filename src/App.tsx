import { useState } from "react";
import { Home } from "./components/Home";
import { Growth } from "./components/Growth";
import { Security } from "./components/Security";
import { Stats } from "./components/Stats";
import { TransactionDetails } from "./components/TransactionDetails";
import { AllTransactions } from "./components/AllTransactions";
import { Navigation } from "./components/Navigation";
import { BiometricLogin } from "./components/BiometricLogin";
import { useKolaWallet } from "./hooks/useKolaWallet";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "growth" | "security">(
    "home"
  );
  const [showStats, setShowStats] = useState(false);
  const [statsType, setStatsType] = useState<"monthly" | "daily">("monthly");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<
    "local" | "international" | "payin"
  >("local");
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const {
    balance,
    transactions,
    savingsGoals,
    groups,
    organizations,
    loading,
    createTransaction,
    refreshData,
  } = useKolaWallet();

  if (!isLoggedIn) {
    return <BiometricLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleNavigateToStats = (type: "monthly" | "daily") => {
    setStatsType(type);
    setShowStats(true);
  };

  const handleQuickAction = (type: "local" | "international" | "payin") => {
    setTransferType(type);
    setShowTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  const handleCreateTransaction = async (
    type: "sent" | "received" | "recurring",
    recipient: string,
    amount: number,
    method: string
  ): Promise<void> => {
    const normalizedType: "sent" | "received" =
      type === "recurring" ? "sent" : type;
    await createTransaction(normalizedType, recipient, amount, method);
  };

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleBackFromTransactionDetails = () => {
    setShowTransactionDetails(false);
    setSelectedTransaction(null);
  };

  const handleViewAllTransactions = () => {
    setShowAllTransactions(true);
  };

  const handleBackFromAllTransactions = () => {
    setShowAllTransactions(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Content Scroll Area fills remaining space even when empty */}
      <div
        className="flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto"
        style={{
          marginBottom:
            !showStats &&
            !showTransferModal &&
            !showTransactionDetails &&
            !showAllTransactions
              ? "4rem"
              : "0rem",
        }}
      >
        {showTransactionDetails && selectedTransaction ? (
          <TransactionDetails
            transaction={selectedTransaction}
            onBack={handleBackFromTransactionDetails}
          />
        ) : showAllTransactions ? (
          <AllTransactions
            transactions={transactions}
            onBack={handleBackFromAllTransactions}
            onTransactionClick={handleTransactionClick}
          />
        ) : showStats ? (
          <Stats
            type={statsType}
            transactions={transactions}
            onBack={() => setShowStats(false)}
            onTransactionClick={handleTransactionClick}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <Home
                balance={balance}
                transactions={transactions}
                loading={loading}
                createTransaction={handleCreateTransaction}
                refreshData={refreshData}
                onNavigateToStats={handleNavigateToStats}
                onQuickAction={handleQuickAction}
                showTransferModal={showTransferModal}
                transferType={transferType}
                onCloseTransferModal={handleCloseTransferModal}
                onTransactionClick={handleTransactionClick}
                onViewAllTransactions={handleViewAllTransactions}
              />
            )}
            {activeTab === "growth" && <Growth />}
            {activeTab === "security" && <Security />}
          </>
        )}
      </div>

      {/* Navigation Section - fixed to viewport bottom */}
      {!showStats &&
        !showTransferModal &&
        !showTransactionDetails &&
        !showAllTransactions && (
          <footer
            className="fixed inset-x-0 bottom-0 h-16 bg-slate-50 border-t border-slate-200 z-50 w-full"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              marginBottom: 20,
            }}
          >
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          </footer>
        )}
    </div>
  );
}
