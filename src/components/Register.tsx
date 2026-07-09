import React, { useState } from "react";
import { User as UserIcon, Mail, Phone, Lock, UserCheck, Shield } from "lucide-react";
import { User, ActivePage } from "../types";

interface RegisterProps {
  onRegisterSuccess: (user: User) => void;
  setPage: (page: ActivePage) => void;
}

export default function Register({ onRegisterSuccess, setPage }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "recycler">("user");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please key in your name and email.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          companyName: role === "recycler" ? companyName || "EcoCenter Logistics" : undefined
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Automatically log the user in
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.error);
      }
      onRegisterSuccess(loginData.user);
    } catch (err: any) {
      setError(err.message || "Registration error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-sm text-slate-500">Join the Waste2Wealth eco-exchange network</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`py-3 rounded-xl font-bold text-xs transition-all uppercase tracking-wider cursor-pointer ${
              role === "user"
                ? "bg-white text-[#064E3B] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Waste Seller / Producer
          </button>
          <button
            type="button"
            onClick={() => setRole("recycler")}
            className={`py-3 rounded-xl font-bold text-xs transition-all uppercase tracking-wider cursor-pointer ${
              role === "recycler"
                ? "bg-white text-[#064E3B] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Lock-In Recycler
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                />
              </div>
            </div>
          </div>

          {role === "recycler" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name (e.g. EcoCenter Logistics)</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="EcoCenter Logistics"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#064E3B] text-white hover:bg-[#064E3B]/95 font-bold text-sm rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Registering account..." : "Complete Registration"}
            <UserCheck className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <button onClick={() => setPage("login")} className="text-[#064E3B] font-bold hover:underline cursor-pointer">
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  );
}
