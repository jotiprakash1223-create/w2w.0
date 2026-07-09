import { ArrowRight, Leaf, Shield, Award, Sparkles, TrendingUp, IndianRupee } from "lucide-react";
import { User, ActivePage } from "../types";

interface HomeProps {
  user: User | null;
  setPage: (page: ActivePage) => void;
}

export default function Home({ user, setPage }: HomeProps) {
  const handlePrimaryCTA = () => {
    if (!user) {
      setPage("register");
    } else if (user.role === "recycler") {
      setPage("dashboard-recycler");
    } else {
      setPage("sell");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#064E3B]/10 text-[#064E3B] text-xs font-semibold rounded-full border border-[#064E3B]/10">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering Green Futures & Secondary Market Economics
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Transform <span className="text-emerald-600">Waste</span> into <span className="text-[#064E3B]">Wealth</span>.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Connecting waste producers with authorized recyclers. Schedule immediate pickups, earn reward points, and track your environmental footprint on a blockchain-grade compliance dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handlePrimaryCTA}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold bg-[#064E3B] text-white rounded-xl shadow-sm hover:bg-[#064E3B]/95 transition-all active:scale-95 cursor-pointer"
              >
                {user ? "Proceed to Panel" : "Start Selling Waste"}
                <ArrowRight className="w-5 h-5" />
              </button>
              {!user && (
                <button
                  onClick={() => setPage("login")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-[#064E3B] border border-slate-200 hover:bg-slate-50 bg-white rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Sign In to Account
                </button>
              )}
            </div>
          </div>

          {/* Visual Presentation */}
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-emerald-300 rounded-full filter blur-3xl opacity-20"></div>
            <div className="bg-white rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-w-md w-full">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                    <Award className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Green Rewards</h3>
                    <p className="text-xs text-slate-400">Total points awarded today</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-extrabold text-lg">+12,500</span>
              </div>

              {/* Sample Pickup Card */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">#REQ-402</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-semibold text-[10px]">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">E-Waste (Laptop & Batteries)</span>
                    <span className="font-semibold text-slate-500">12.5 kg</span>
                  </div>
                  <div className="text-xs text-slate-400">Pickup: Bandra West, Mumbai, MH</div>
                </div>

                <div className="bg-[#064E3B] text-white p-4 rounded-xl space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Environmental Scorecard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-2">
                    <div className="bg-[#064E3B]/70 p-2 rounded-lg">
                      <p className="text-[10px] text-emerald-200 uppercase">CO2 Prevented</p>
                      <p className="font-mono text-sm font-bold">1,424.0 kg</p>
                    </div>
                    <div className="bg-[#064E3B]/70 p-2 rounded-lg">
                      <p className="text-[10px] text-emerald-200 uppercase">Trees Equivalent</p>
                      <p className="font-mono text-sm font-bold">96 trees</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A Bulletproof Eco-System for Solid Waste Exchange
            </h2>
            <p className="text-slate-600">
              By connecting everyday waste producers directly with recyclers, we turn plastic, cardboard, scrap metal, and electronic debris into real currency.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
              <span className="inline-flex p-3 bg-emerald-50 rounded-xl text-emerald-700">
                <Leaf className="w-6 h-6" />
              </span>
              <h3 className="font-bold text-lg text-slate-800">Schedule Instantly</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose categories, sliders for approximate weight values, and list pickup addresses in seconds.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
              <span className="inline-flex p-3 bg-teal-50 rounded-xl text-teal-700">
                <IndianRupee className="w-6 h-6" />
              </span>
              <h3 className="font-bold text-lg text-slate-800">Earn Real Wealth</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Receive award points upon certified recycling. Exchange points or claim cash directly from the platform.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
              <span className="inline-flex p-3 bg-amber-50 rounded-xl text-amber-700">
                <TrendingUp className="w-6 h-6" />
              </span>
              <h3 className="font-bold text-lg text-slate-800">Clear Analytics</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Track trees planted, water saved, and carbon displacement for compliant sustainability reports.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
              <span className="inline-flex p-3 bg-blue-50 rounded-xl text-blue-700">
                <Shield className="w-6 h-6" />
              </span>
              <h3 className="font-bold text-lg text-slate-800">Certified Recycling</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our logistics network guarantees compliant and ethical zero-landfill electronic and physical waste destruction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Environmental Impact Stats */}
      <section className="py-16 bg-[#064E3B] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in">
          <div>
            <h4 className="text-4xl font-extrabold font-mono text-white">148.4k</h4>
            <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-wider mt-2.5">kg Waste Collected</p>
          </div>
          <div>
            <h4 className="text-4xl font-extrabold font-mono text-white">356.2k</h4>
            <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-wider mt-2.5">kg CO2 Savings</p>
          </div>
          <div>
            <h4 className="text-4xl font-extrabold font-mono text-white">18,500+</h4>
            <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-wider mt-2.5">Trees Restored</p>
          </div>
          <div>
            <h4 className="text-4xl font-extrabold font-mono text-white">1.2M</h4>
            <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-wider mt-2.5">Loyalty Points Claimed</p>
          </div>
        </div>
      </section>
    </div>
  );
}
