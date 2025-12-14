import { Send, Globe, ArrowDownToLine } from "lucide-react";

interface QuickActionsProps {
  onAction: (type: "local" | "international" | "payin") => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div>
      <h3 className="text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {/* Local Transfer */}
        <button
          onClick={() => onAction("local")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Send className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-slate-900 text-sm">Local</span>
          <span className="text-slate-500 text-xs">MoMo/OM</span>
        </button>

        {/* International Wire */}
        <button
          onClick={() => onAction("international")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-slate-900 text-sm">Int'l Wire</span>
          <span className="text-slate-500 text-xs">SWIFT</span>
        </button>

        {/* Payins */}
        <button
          onClick={() => onAction("payin")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <ArrowDownToLine className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-slate-900 text-sm">Receive</span>
          <span className="text-slate-500 text-xs">Payin</span>
        </button>
      </div>
    </div>
  );
}
