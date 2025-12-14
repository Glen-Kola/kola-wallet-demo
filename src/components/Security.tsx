import { useState } from "react";
import {
  Lock,
  Fingerprint,
  Bell,
  UserCheck,
  DollarSign,
  Eye,
  ChevronRight,
} from "lucide-react";
import { CreditScoreCard } from "./CreditScoreCard";

export function Security() {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-slate-900">Security Center</h1>
        <p className="text-slate-500 text-sm">Manage your account security</p>
      </div>

      {/* Credit Score Card */}
      <CreditScoreCard />

      {/* Authentication */}
      <div>
        <h3 className="text-slate-900 mb-3">Authentication</h3>
        <div className="space-y-2">
          {/* Biometric */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-900">Biometric Login</p>
                <p className="text-slate-500 text-sm">Face ID or Fingerprint</p>
              </div>
            </div>
            <button
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                biometricEnabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  biometricEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>

          {/* Two-Factor */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-900">Two-Factor Auth</p>
                <p className="text-slate-500 text-sm">SMS verification</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  twoFactorEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-slate-900 mb-3">Notifications</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-900">Transaction Alerts</p>
              <p className="text-slate-500 text-sm">
                Get notified of all activity
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${
              notificationsEnabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                notificationsEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Limits & Permissions */}
      <div>
        <h3 className="text-slate-900 mb-3">Limits & Permissions</h3>
        <div className="space-y-2">
          {/* Transaction Limits */}
          <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-slate-900">Transaction Limits</p>
                <p className="text-slate-500 text-sm">
                  Daily: $5,000 / Monthly: $50,000
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Role Management */}
          <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-slate-900">Role Management</p>
                <p className="text-slate-500 text-sm">
                  Manage business permissions
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Privacy Settings */}
          <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-slate-900">Privacy Settings</p>
                <p className="text-slate-500 text-sm">
                  Control your data visibility
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Recent Security Activity */}
      <div>
        <h3 className="text-slate-900 mb-3">Recent Activity</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-slate-900 text-sm">Login from iPhone 14</p>
                <p className="text-slate-500 text-xs">
                  Today at 9:41 AM • New York, US
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-slate-900 text-sm">Password changed</p>
                <p className="text-slate-500 text-xs">
                  Dec 10 at 3:22 PM • New York, US
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-slate-900 text-sm">New device authorized</p>
                <p className="text-slate-500 text-xs">
                  Dec 8 at 11:05 AM • New York, US
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
