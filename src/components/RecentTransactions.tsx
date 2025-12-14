import { ArrowUpRight, ArrowDownLeft, Repeat } from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  onTransactionClick: (transaction: Transaction) => void;
  onViewAllTransactions: () => void;
}

export function RecentTransactions({
  transactions,
  loading,
  onTransactionClick,
  onViewAllTransactions,
}: RecentTransactionsProps) {
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

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-900">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-900">Recent Activity</h3>
        <button
          onClick={onViewAllTransactions}
          className="text-emerald-600 text-sm hover:text-emerald-700 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-2">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction) => (
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

              {/* Details */}
              <div className="flex-1">
                <p className="text-slate-900">{transaction.recipient}</p>
                <p className="text-slate-500 text-sm">
                  {formatDate(transaction.date)}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {transaction.method}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`${
                    transaction.type === "sent"
                      ? "text-slate-900"
                      : "text-emerald-600"
                  }`}
                >
                  {transaction.type === "sent" ? "-" : "+"}$
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
