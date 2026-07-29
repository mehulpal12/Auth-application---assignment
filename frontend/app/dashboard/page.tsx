"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  LogOut,
  RefreshCw,
  Clock,
  Server
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoadingApi(true);
    setError("");
    try {
      const res = await api.get("/dashboard");
      setDashboardData(res.data.data);
    } catch (err: any) {
      setError("Failed to fetch protected dashboard API data.");
      console.error(err);
    } finally {
      setLoadingApi(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background light sources */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-2xl relative">
          {/* Header branding */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Secure Auth Workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Protected Dummy Dashboard</p>
          </div>

          {/* Premium Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                  <p className="text-xs text-slate-400">Standard Registered User</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Logged In</span>
              </div>
            </div>

            {/* Profile fields and status details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </span>
                <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> Access Token Expiry
                </span>
                <p className="text-sm font-semibold text-indigo-400">15 Minutes (Short-Lived)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Refresh Token Expiry
                </span>
                <p className="text-sm font-semibold text-purple-400">7 Days (HttpOnly Cookie)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <Server className="w-3 h-3" /> API Security Strategy
                </span>
                <p className="text-sm font-semibold text-slate-300">In-Memory Access Token</p>
              </div>
            </div>

            {/* Protected Backend Data Check */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live API Authorization Check
                </h3>
                <button
                  onClick={fetchDashboardData}
                  disabled={loadingApi}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all cursor-pointer"
                  title="Test Token Refresh or Fetch Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingApi ? "animate-spin" : ""}`} />
                </button>
              </div>

              {loadingApi ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                  <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Fetching protected `/api/dashboard` data...</span>
                </div>
              ) : error ? (
                <p className="text-xs text-rose-400 p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg">{error}</p>
              ) : (
                <div className="text-xs space-y-1.5 p-2 bg-slate-900/60 rounded-xl border border-slate-800/50">
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-300">API Status:</span> {dashboardData?.message}
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-300">Verified ID:</span> {dashboardData?.user?.id}
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-300">Server Time:</span>{" "}
                    <span className="font-mono text-slate-300">{dashboardData?.serverTime}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-slate-800/80">
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700/80 hover:border-rose-800/50 text-slate-300 hover:text-rose-300 text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
