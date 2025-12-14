import { useState } from 'react';
import { X, ChevronRight, CheckCircle } from 'lucide-react';

interface TransferModalProps {
  type: 'local' | 'international' | 'payin';
  onClose: () => void;
  onComplete: (recipient: string, amount: number, method: string) => Promise<void>;
}

export function TransferModal({ type, onClose, onComplete }: TransferModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [method, setMethod] = useState('MTN Mobile Money');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const titles = {
    local: 'Local Transfer',
    international: 'International Wire',
    payin: 'Receive Money'
  };

  const handleContinue = async () => {
    if (step === 1 && amount) {
      setStep(2);
    } else if (step === 2 && recipient) {
      setIsProcessing(true);
      try {
        await onComplete(recipient, parseFloat(amount), method);
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Transaction failed:', error);
        setIsProcessing(false);
      }
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
            <h3 className="text-slate-900">Transfer Successful!</h3>
            <p className="text-slate-600">Your transaction has been processed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fadeIn">
      <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-slate-900">{titles[type]}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 px-6 pt-4">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="text-slate-700 text-sm mb-2 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 pl-8 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              {type === 'local' && (
                <div>
                  <label className="text-slate-700 text-sm mb-2 block">Payment Method</label>
                  <div className="space-y-2">
                    <button
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-between hover:border-emerald-500 transition-colors"
                      onClick={() => setMethod('MTN Mobile Money')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg"></div>
                        <span className="text-slate-900">MTN Mobile Money</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                    <button
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-between hover:border-emerald-500 transition-colors"
                      onClick={() => setMethod('Orange Money')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg"></div>
                        <span className="text-slate-900">Orange Money</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="text-slate-700 text-sm mb-2 block">
                  {type === 'payin' ? 'From' : 'To'}
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={type === 'payin' ? 'Sender name' : 'Recipient name or number'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Amount</span>
                  <span className="text-slate-900">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Fee</span>
                  <span className="text-slate-900">$0.50</span>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">${(parseFloat(amount) + 0.50).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0 pb-8">
          <button
            onClick={handleContinue}
            disabled={(step === 1 ? !amount : !recipient) || isProcessing}
            className="w-full bg-emerald-500 text-white rounded-2xl py-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            {isProcessing ? 'Processing...' : step === 1 ? 'Continue' : 'Confirm Transfer'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}