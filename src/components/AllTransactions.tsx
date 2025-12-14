import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Repeat } from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

interface AllTransactionsProps {
  transactions: Transaction[];
  onBack: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}

export function AllTransactions({
  transactions,
  onBack,
  onTransactionClick,
}: AllTransactionsProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      // Less than a minute
      if (diffMinutes < 1) {
        return "Just now";
      }

      // Less than an hour
      if (diffHours === 0) {
        return `${diffMinutes}m ago`;
      }

      // Today
      if (diffHours < 24 && date.toDateString() === now.toDateString()) {
        return `Today, ${date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`;
      }

      // Yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`;
      }

      // Within last 7 days
      if (diffHours < 168) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        return `${dayName}, ${date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`;
      }

      // Otherwise show full date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals
  const totalSent = transactions
    .filter((tx) => tx.type === "sent")
    .reduce((sum, tx) => sum + tx.amount + 0.5, 0);
  const totalReceived = transactions
    .filter((tx) => tx.type === "received")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                All Transactions
              </h1>
              <p className="text-slate-500 text-sm">
                {transactions.length} total transactions
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-red-600 text-sm font-medium mb-1">
                Total Sent
              </p>
              <p className="text-red-900 text-xl font-bold">
                ${totalSent.toFixed(2)}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-emerald-600 text-sm font-medium mb-1">
                Total Received
              </p>
              <p className="text-emerald-900 text-xl font-bold">
                ${totalReceived.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-6 pb-32">
        <div className="space-y-2">
          {sortedTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <p className="text-slate-500">No transactions yet</p>
            </div>
          ) : (
            sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => onTransactionClick(transaction)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === "sent"
                      ? "bg-red-100"
                      : transaction.type === "received"
                      ? "bg-emerald-100"
                      : "bg-blue-100"
                  }`}
                >
                  {transaction.type === "sent" && (
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  )}
                  {transaction.type === "received" && (
                    <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
                  )}
                  {transaction.type === "recurring" && (
                    <Repeat className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-900 font-medium truncate">
                      {transaction.recipient}
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "sent"
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {transaction.type === "sent" ? "-" : "+"}$
                      {transaction.type === "sent"
                        ? (transaction.amount + 0.5).toFixed(2)
                        : transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-sm">
                      {formatDate(transaction.date)}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {transaction.method}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
