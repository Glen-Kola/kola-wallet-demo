import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
}

interface SmartCardProps {
  balance: number;
  loading?: boolean;
  transactions?: Transaction[];
  onNavigateToStats: (type: "monthly" | "daily") => void;
}

export function SmartCard({
  balance,
  loading,
  transactions = [],
  onNavigateToStats,
}: SmartCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Compute "This Month" net flow and "Spent Today"
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthNet = transactions.reduce((sum, tx) => {
    const d = new Date(tx.date);
    if (d >= startOfMonth && d <= now) {
      if (tx.type === "received") return sum + tx.amount;
      if (tx.type === "sent") return sum - tx.amount - 0.5; // include fee
    }
    return sum;
  }, 0);

  // Calculate last month's net for percentage comparison
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthNet = transactions.reduce((sum, tx) => {
    const d = new Date(tx.date);
    if (d >= lastMonthStart && d <= lastMonthEnd) {
      if (tx.type === "received") return sum + tx.amount;
      if (tx.type === "sent") return sum - tx.amount - 0.5;
    }
    return sum;
  }, 0);

  const monthPercentageChange =
    lastMonthNet !== 0
      ? ((thisMonthNet - lastMonthNet) / Math.abs(lastMonthNet)) * 100
      : thisMonthNet > 0
      ? 100
      : 0;

  const netSpendToday = transactions.reduce((sum, tx) => {
    const d = new Date(tx.date);
    const isSameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (isSameDay) {
      if (tx.type === "received") return sum + tx.amount;
      if (tx.type === "sent") return sum - tx.amount - 0.5; // include fee
    }
    return sum;
  }, 0);

  // Calculate yesterday's net spending for percentage comparison
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const netSpendYesterday = transactions.reduce((sum, tx) => {
    const d = new Date(tx.date);
    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate();
    if (isYesterday) {
      if (tx.type === "received") return sum + tx.amount;
      if (tx.type === "sent") return sum - tx.amount - 0.5;
    }
    return sum;
  }, 0);

  const dailyPercentageChange =
    netSpendYesterday !== 0
      ? ((netSpendToday - netSpendYesterday) / Math.abs(netSpendYesterday)) *
        100
      : netSpendToday > 0
      ? 100
      : 0;

  const todayTransactionCount = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  const handleOpenStats = (type: "monthly" | "daily") => {
    onNavigateToStats(type);
  };

  return (
    <div className="relative">
      {/* Main Card */}
      <div
        className="rounded-3xl p-6 shadow-lg text-white"
        style={{
          backgroundColor: "#543c52",
        }}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-white/70 text-sm mb-1">Total Balance</p>
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="h-8 w-32 bg-slate-700 rounded animate-pulse"></div>
              ) : isBalanceVisible ? (
                <h2 className="text-primary">${balance.toFixed(2)}</h2>
              ) : (
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                </div>
              )}
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isBalanceVisible ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div
            className="bg-white/15 text-white text-xs px-3 py-1 rounded-full border border-white/20"
            style={{
              background: balance >= 0 ? "lemongreen" : "lightcoral",
            }}
          >
            {balance >= 0 ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-xs mb-1">Card Number</p>
            <p className="text-primary text-sm">•••• •••• •••• 4829</p>
          </div>
          <div className="flex gap-1">
            <div className="w-8 h-8 bg-[#543c52] rounded-full opacity-80"></div>
            <div className="w-8 h-8 bg-[#7a5e84] rounded-full opacity-80 -ml-3"></div>
          </div>
        </div>

        {/* Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7a5e84] to-[#543c52] rounded-t-3xl"></div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOpenStats("monthly")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow cursor-pointer"
        >
          <p className="text-slate-500 text-xs mb-1">This Month</p>
          <p className="text-slate-900">
            {thisMonthNet >= 0 ? "+" : "-"}${Math.abs(thisMonthNet).toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <svg
              className={`w-3 h-3 ${
                monthPercentageChange >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {monthPercentageChange >= 0 ? (
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            <span
              className={`${
                monthPercentageChange >= 0 ? "text-emerald-600" : "text-red-600"
              } text-xs`}
            >
              {Math.abs(monthPercentageChange).toFixed(1)}%
            </span>
          </div>
        </button>
        <button
          onClick={() => handleOpenStats("daily")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow cursor-pointer"
        >
          <p className="text-slate-500 text-xs mb-1">Net Spend Today</p>
          <p className="text-slate-900">
            {netSpendToday >= 0 ? "+" : "-"}$
            {Math.abs(netSpendToday).toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <svg
              className={`w-3 h-3 ${
                dailyPercentageChange >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {dailyPercentageChange >= 0 ? (
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            <span
              className={`${
                dailyPercentageChange >= 0 ? "text-emerald-600" : "text-red-600"
              } text-xs`}
            >
              {Math.abs(dailyPercentageChange).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-slate-400 text-xs">
              {todayTransactionCount} transaction
              {todayTransactionCount === 1 ? "" : "s"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
