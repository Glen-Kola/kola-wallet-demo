import { ArrowLeft, Printer, Download, CheckCircle } from "lucide-react";
import { useRef } from "react";

interface Transaction {
  id: string;
  type: "sent" | "received" | "recurring";
  recipient: string;
  amount: number;
  date: string;
  method: string;
  status?: string;
}

interface TransactionDetailsProps {
  transaction: Transaction;
  onBack: () => void;
}

export function TransactionDetails({
  transaction,
  onBack,
}: TransactionDetailsProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const transactionFee = transaction.type === "sent" ? 0.5 : 0;
  const totalAmount =
    transaction.type === "sent"
      ? transaction.amount + transactionFee
      : transaction.amount;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - No Print */}
      <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div>
              <h2 className="text-slate-900 text-xl font-bold">
                Transaction Details
              </h2>
              <p className="text-slate-500 text-sm">ID: {transaction.id}</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-[#543c52] hover:text-[#6b4c66] transition-colors"
          >
            <Printer className="w-5 h-5" />
            <span className="text-sm font-medium">Print</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto pb-24">
        {/* Status Badge */}
        <div className="mb-4 print:mb-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-slate-900 text-2xl font-bold mb-2">
              {transaction.type === "sent"
                ? "Payment Sent"
                : transaction.type === "received"
                ? "Payment Received"
                : "Recurring Payment"}
            </h3>
            <p className="text-slate-500 text-sm">
              {transaction.status || "Completed"}
            </p>
          </div>
        </div>

        {/* Receipt Section */}
        <div
          ref={receiptRef}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 print:shadow-none print:border-2"
        >
          {/* Print Header */}
          <div className="hidden print:block mb-8 border-b-2 border-slate-200 pb-6">
            <h1 className="text-3xl font-bold text-[#543c52] mb-2">
              Kola Wallet
            </h1>
            <p className="text-slate-600 text-sm">
              Official Transaction Receipt
            </p>
          </div>

          {/* Amount Section */}
          <div className="text-center mb-6 pb-6 border-b border-slate-200">
            <p className="text-slate-500 text-sm mb-2">Amount</p>
            <h2 className="text-slate-900 text-4xl font-bold">
              {transaction.type === "sent" ? "-" : "+"}$
              {transaction.amount.toFixed(2)}
            </h2>
            {transaction.type === "sent" && transactionFee > 0 && (
              <p className="text-slate-500 text-sm mt-2">
                Fee: ${transactionFee.toFixed(2)}
              </p>
            )}
          </div>

          {/* Transaction Information */}
          <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
            <h3 className="text-slate-900 font-semibold mb-3">
              Transaction Information
            </h3>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Transaction ID</span>
              <span className="text-slate-900 font-mono text-sm">
                {transaction.id}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Type</span>
              <span className="text-slate-900 font-semibold capitalize">
                {transaction.type}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">
                {transaction.type === "sent" ? "Recipient" : "Sender"}
              </span>
              <span className="text-slate-900 font-semibold">
                {transaction.recipient}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Payment Method</span>
              <span className="text-slate-900 font-semibold">
                {transaction.method}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Date</span>
              <span className="text-slate-900 font-semibold">
                {formatDate(transaction.date)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Time</span>
              <span className="text-slate-900 font-semibold">
                {formatTime(transaction.date)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Status</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {transaction.status || "Completed"}
              </span>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
            <h3 className="text-slate-900 font-semibold mb-3">
              Amount Breakdown
            </h3>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Transaction Amount</span>
              <span className="text-slate-900 font-semibold">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>

            {transaction.type === "sent" && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Transaction Fee</span>
                <span className="text-slate-900 font-semibold">
                  ${transactionFee.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-slate-900 font-bold">Total Amount</span>
              <span className="text-slate-900 font-bold text-lg">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-3 mb-6">
            <h3 className="text-slate-900 font-semibold mb-3">
              Account Information
            </h3>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Account Name</span>
              <span className="text-slate-900 font-semibold">Alex Johnson</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Account Number</span>
              <span className="text-slate-900 font-mono text-sm">
                •••• •••• •••• 4829
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Email</span>
              <span className="text-slate-900 text-sm">
                alex.johnson@kolamail.com
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-slate-600 text-xs leading-relaxed">
              This is an official receipt from Kola Wallet. For any inquiries
              regarding this transaction, please contact our support team at
              support@kolawallet.com or call +1 (555) 123-4567.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Generated on {new Date().toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {/* Action Buttons - No Print */}
        {/* <div className="mt-4 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-[#543c52] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-slate-100 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div> */}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-2 {
            border-width: 2px !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
