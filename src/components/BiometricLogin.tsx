import { Fingerprint } from "lucide-react";

interface BiometricLoginProps {
  onLogin: () => void;
}

export function BiometricLogin({ onLogin }: BiometricLoginProps) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#543c52] to-[#2f2232] flex items-center justify-center p-4"
      style={{
        backgroundColor: "#543c52",
        flex: 1,
      }}
    >
      <div className="w-full max-w-[400px] text-center space-y-8">
        {/* Logo */}
        <div className="space-y-2">
          <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden p-4">
            <img
              src="/logo.png"
              alt="Kola Wallet"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-white text-bold">Kola Wallet</h1>
          <p className="text-slate-400 text-sm">
            Better Control on Your Finances
          </p>
        </div>

        {/* Biometric Button */}
        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-32 h-32 bg-white bg-opacity-10 backdrop-blur-lg rounded-full mx-auto flex items-center justify-center hover:bg-opacity-20 transition-all active:scale-95 shadow-2xl border border-white border-opacity-20"
          >
            <Fingerprint className="w-16 h-16 text-[#c9b6d3]" />
          </button>
          <p className="text-white">Tap to unlock</p>
          <p className="text-slate-400 text-sm">Use Face ID or Fingerprint</p>
        </div>

        {/* Alternative Login */}
        <button className="text-[#c9b6d3] text-sm hover:text-[#e1d4e6] transition-colors">
          Use PIN instead
        </button>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-slate-500 text-xs">
            Protected by end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
}
