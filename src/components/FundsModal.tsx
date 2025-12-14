import { useState } from "react";
import { X, ArrowDownLeft, ArrowUpRight, CheckCircle } from "lucide-react";

interface FundsModalProps {
  type: "deposit" | "withdraw" | "emergency";
  targetType: "savings" | "group" | "organization";
  targetName: string;
  targetId: string;
  currentBalance: number;
  maxWithdraw?: number;
  penaltyRate?: number;
  onClose: () => void;
  onComplete: (amount: number) => Promise<void>;
}

export function FundsModal({
  type,
  targetType,
  targetName,
  targetId,
  currentBalance,
  maxWithdraw,
  penaltyRate,
  onClose,
  onComplete,
}: FundsModalProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (type !== "deposit" && maxWithdraw && amountNum > maxWithdraw) {
      alert(`Maximum withdrawal amount is $${maxWithdraw.toFixed(2)}`);
      return;
    }

    setIsProcessing(true);
    try {
      await onComplete(amountNum);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fadeIn">
        <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-slideUp p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-slate-900">
              {type === "deposit"
                ? "Deposit Successful!"
                : type === "emergency"
                ? "Emergency Withdrawal Successful!"
                : "Withdrawal Successful!"}
            </h3>
            <p className="text-slate-600">${parseFloat(amount).toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  const targetTypeLabel =
    targetType === "organization"
      ? "Organization"
      : targetType === "savings"
      ? "Savings Goal"
      : "Group";

  const isEmergency = type === "emergency";
  const penaltyPercent = (penaltyRate || 0) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isEmergency
                  ? "bg-amber-100"
                  : type === "deposit"
                  ? "bg-emerald-100"
                  : "bg-orange-100"
              }`}
            >
              {type === "deposit" ? (
                <ArrowDownLeft className={`w-6 h-6 text-emerald-600`} />
              ) : (
                <ArrowUpRight
                  className={`w-6 h-6 ${
                    isEmergency ? "text-amber-600" : "text-orange-600"
                  }`}
                />
              )}
            </div>
            <div>
              <h2 className="text-slate-900">
                {type === "deposit"
                  ? "Deposit Funds"
                  : isEmergency
                  ? "Emergency Withdrawal"
                  : "Withdraw Funds"}
              </h2>
              <p className="text-slate-500 text-sm">{targetTypeLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Info */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-slate-500 text-sm mb-1">{targetTypeLabel}</p>
            <p className="text-slate-900 font-medium">{targetName}</p>
            <p className="text-slate-600 text-sm mt-2">
              Current Balance: ${currentBalance.toFixed(2)}
            </p>
            {type === "withdraw" && maxWithdraw && (
              <p className="text-orange-600 text-sm mt-1">
                Maximum withdrawal: ${maxWithdraw.toFixed(2)}
              </p>
            )}
            {isEmergency && (
              <p className="text-amber-600 text-sm mt-2">
                Emergency penalty: {penaltyPercent.toFixed(1)}% applied to the
                withdrawn amount.
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-slate-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-12 py-4 text-2xl focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Amounts */}
          {type === "deposit" && (
            <div>
              <p className="text-slate-600 text-sm mb-2">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2 text-sm transition-colors"
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            className={`${
              isEmergency
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            } w-full text-white py-4 rounded-2xl font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed`}
          >
            {isProcessing
              ? "Processing..."
              : `${
                  type === "deposit"
                    ? "Deposit"
                    : isEmergency
                    ? "Emergency Withdraw"
                    : "Withdraw"
                } $${amount || "0.00"}`}
          </button>

          {/* Info */}
          <p className="text-slate-500 text-xs text-center">
            {type === "deposit"
              ? "Funds will be deducted from your main wallet balance"
              : isEmergency
              ? `Penalty of ${penaltyPercent.toFixed(
                  1
                )}% applies. Payout is credited to your wallet.`
              : "Funds will be added to your main wallet balance"}
          </p>
        </div>
      </div>
    </div>
  );
}
