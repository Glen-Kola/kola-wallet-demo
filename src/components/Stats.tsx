import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
}

interface StatsProps {
  type: "monthly" | "daily";
  transactions: Transaction[];
  onBack: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}

export function Stats({
  type,
  transactions,
  onBack,
  onTransactionClick,
}: StatsProps) {
  const now = new Date();

  // Prepare data based on type
  const getData = () => {
    if (type === "daily") {
      // Group transactions by hour for today
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        sent: 0,
        received: 0,
        net: 0,
      }));

      transactions.forEach((tx) => {
        const d = new Date(tx.date);
        const isSameDay =
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate();

        if (isSameDay) {
          const hour = d.getHours();
          if (tx.type === "sent") {
            hourlyData[hour].sent += tx.amount + 0.5;
            hourlyData[hour].net -= tx.amount + 0.5;
          } else if (tx.type === "received") {
            hourlyData[hour].received += tx.amount;
            hourlyData[hour].net += tx.amount;
          }
        }
      });

      return hourlyData.filter((d) => d.sent > 0 || d.received > 0);
    } else {
      // Group transactions by day for this month
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
        day: `${i + 1}`,
        sent: 0,
        received: 0,
        net: 0,
      }));

      transactions.forEach((tx) => {
        const d = new Date(tx.date);
        const isSameMonth =
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth();

        if (isSameMonth) {
          const day = d.getDate() - 1;
          if (tx.type === "sent") {
            dailyData[day].sent += tx.amount + 0.5;
            dailyData[day].net -= tx.amount + 0.5;
          } else if (tx.type === "received") {
            dailyData[day].received += tx.amount;
            dailyData[day].net += tx.amount;
          }
        }
      });

      return dailyData;
    }
  };

  const data = getData();

  // Calculate totals
  const totals = data.reduce(
    (acc, item) => ({
      sent: acc.sent + item.sent,
      received: acc.received + item.received,
      net: acc.net + item.net,
    }),
    { sent: 0, received: 0, net: 0 }
  );

  const title = type === "daily" ? "Today's Activity" : "This Month";
  const subtitle =
    type === "daily"
      ? now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      : now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Filter relevant transactions
  const relevantTransactions = transactions.filter((tx) => {
    const d = new Date(tx.date);
    if (type === "daily") {
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    } else {
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-slate-900 text-2xl font-bold">{title}</h2>
            <p className="text-slate-500 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-2xl p-4">
            <p className="text-red-600 text-xs mb-1">Total Sent</p>
            <p className="text-red-900 text-xl font-semibold">
              ${totals.sent.toFixed(2)}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4">
            <p className="text-emerald-600 text-xs mb-1">Total Received</p>
            <p className="text-emerald-900 text-xl font-semibold">
              ${totals.received.toFixed(2)}
            </p>
          </div>
          <div
            className={`${
              totals.net >= 0 ? "bg-blue-50" : "bg-orange-50"
            } rounded-2xl p-4`}
          >
            <p
              className={`${
                totals.net >= 0 ? "text-blue-600" : "text-orange-600"
              } text-xs mb-1`}
            >
              Net Flow
            </p>
            <p
              className={`${
                totals.net >= 0 ? "text-blue-900" : "text-orange-900"
              } text-xl font-semibold flex items-center gap-1`}
            >
              {totals.net >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              {totals.net >= 0 ? "+" : "-"}${Math.abs(totals.net).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Net Flow Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 text-lg font-semibold mb-4">
            Net Flow
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={type === "daily" ? "hour" : "day"}
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px",
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorNet)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sent vs Received Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 text-lg font-semibold mb-4">
            Sent vs Received
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={type === "daily" ? "hour" : "day"}
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px",
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Bar dataKey="sent" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="received" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 text-lg font-semibold mb-4">
            Transactions
          </h3>
          <div className="space-y-3">
            {relevantTransactions.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No transactions for this period
              </p>
            ) : (
              relevantTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onTransactionClick(tx)}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors -mx-2 px-2 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{tx.recipient}</p>
                    <p className="text-slate-500 text-sm">
                      {new Date(tx.date).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === "sent" ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {tx.type === "sent" ? "-" : "+"}$
                      {tx.type === "sent"
                        ? (tx.amount + 0.5).toFixed(2)
                        : tx.amount.toFixed(2)}
                    </p>
                    <p className="text-slate-400 text-xs">{tx.method}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
