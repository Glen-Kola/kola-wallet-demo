import { Home, TrendingUp, Shield } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'growth' | 'security';
  onTabChange: (tab: 'home' | 'growth' | 'security') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center">
      <button
        onClick={() => onTabChange('home')}
        className="flex flex-col items-center gap-1 py-2 px-4 transition-all"
      >
        <div className={`${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
          <Home className="w-6 h-6" />
        </div>
        <span className={`text-xs ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
          Home
        </span>
        {activeTab === 'home' && (
          <div className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></div>
        )}
      </button>

      <button
        onClick={() => onTabChange('growth')}
        className="flex flex-col items-center gap-1 py-2 px-4 transition-all"
      >
        <div className={`${activeTab === 'growth' ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
          <TrendingUp className="w-6 h-6" />
        </div>
        <span className={`text-xs ${activeTab === 'growth' ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
          Growth
        </span>
        {activeTab === 'growth' && (
          <div className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></div>
        )}
      </button>

      <button
        onClick={() => onTabChange('security')}
        className="flex flex-col items-center gap-1 py-2 px-4 transition-all"
      >
        <div className={`${activeTab === 'security' ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
          <Shield className="w-6 h-6" />
        </div>
        <span className={`text-xs ${activeTab === 'security' ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
          Security
        </span>
        {activeTab === 'security' && (
          <div className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></div>
        )}
      </button>
    </div>
  );
}
