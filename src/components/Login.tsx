import React, { useState } from "react";
import { Mail, Lock, LogIn, Award, Sparkles, Pin } from "lucide-react";
import { User, ActivePage } from "../types";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  setPage: (page: ActivePage) => void;
}

export default function Login({ onLoginSuccess, setPage }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please key in your email address.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login fail");
      }
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: "user" | "recycler") => {
    setError(null);
    setLoading(true);
    const targetEmail = role === "user" ? "john.doe@example.com" : "alex@example.com";
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: "password123" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-100 space-y-6 relative">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back!</h2>
          <p className="text-sm text-slate-500">Access your Waste2Wealth portal exchanges</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#064E3B] text-white hover:bg-[#064E3B]/95 font-bold text-sm rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <LogIn className="w-4.5 h-4.5" />
          </button>
        </form>

        {/* Quick Testing Profiles */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-4 h-4 text-[#064E3B] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Quick Preset Profiles</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin("user")}
              className="p-3 bg-[#064E3B]/5 rounded-xl border border-[#064E3B]/10 text-left hover:bg-[#064E3B]/10 transition-colors cursor-pointer group"
            >
              <p className="text-[10px] uppercase font-bold text-[#064E3B]">Demo Seller</p>
              <p className="text-xs font-bold text-slate-800">John Doe</p>
            </button>
            <button
              onClick={() => handleQuickLogin("recycler")}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:bg-slate-100 transition-colors cursor-pointer group"
            >
              <p className="text-[10px] uppercase font-bold text-slate-500">Logistics Recycler</p>
              <p className="text-xs font-bold text-slate-800">Alex Rivera</p>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          New here?{" "}
          <button onClick={() => setPage("register")} className="text-[#064E3B] font-bold hover:underline cursor-pointer">
            Register for Free
          </button>
        </div>
      </div>
    </div>
  );
}
