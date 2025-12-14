import React, { useState } from "react";
import { ArrowLeft, Delete } from "lucide-react";

interface PinLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const PinLogin: React.FC<PinLoginProps> = ({ onLogin, onBack }) => {
  const [pin, setPin] = useState<string>("");
  const pinLength = 4;

  const handleNumberClick = (num: number) => {
    if (pin.length < pinLength) {
      const newPin = pin + num;
      setPin(newPin);

      // Auto-submit when PIN is complete
      if (newPin.length === pinLength) {
        setTimeout(() => {
          onLogin();
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#543c52] to-[#2f2232] flex items-center justify-center p-4"
      style={{
        backgroundColor: "#543c52",
        flex: 1,
      }}
    >
      <div className="w-full max-w-[400px] text-center space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="text-white hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden p-4">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Kola Wallet"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-white text-bold">Enter PIN</h1>
          <p className="text-slate-400 text-sm">
            Enter your 4-digit PIN to unlock
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 py-8">
          {[...Array(pinLength)].map((_, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                index < pin.length
                  ? "bg-[#c9b6d3] shadow-lg"
                  : "bg-white bg-opacity-10 border border-white border-opacity-20"
              }`}
            >
              {index < pin.length && (
                <div className="w-4 h-4 bg-white rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-20 h-20 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-primary text-2xl font-semibold hover:bg-opacity-20 transition-all active:scale-95 shadow-lg border border-white border-opacity-20"
            >
              {num}
            </button>
          ))}
          <div className="w-20 h-20" /> {/* Empty space */}
          <button
            onClick={() => handleNumberClick(0)}
            className="w-20 h-20 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-primary text-2xl font-semibold hover:bg-opacity-20 transition-all active:scale-95 shadow-lg border border-white border-opacity-20"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={pin.length === 0}
            className="w-20 h-20 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-primary hover:bg-opacity-20 transition-all active:scale-95 shadow-lg border border-white border-opacity-20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-slate-500 text-xs">
            Protected by end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
};
