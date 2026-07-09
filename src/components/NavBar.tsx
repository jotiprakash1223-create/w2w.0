import { Recycle, LogOut, User as UserIcon } from "lucide-react";
import { User, ActivePage } from "../types";

interface NavBarProps {
  user: User | null;
  activePage: ActivePage;
  setPage: (page: ActivePage) => void;
  onLogout: () => void;
}

export default function NavBar({ user, activePage, setPage, onLogout }: NavBarProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <nav className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto h-20">
        <div className="flex items-center gap-8 cursor-pointer" onClick={() => setPage("home")}>
          <div className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-[#064E3B]/10 rounded-xl group-hover:bg-[#064E3B]/20 transition-all duration-300">
              <Recycle className="text-[#064E3B] w-6.5 h-6.5 animate-spin-slow group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#064E3B] to-emerald-700 bg-clip-text text-transparent">
              Waste2Wealth
            </span>
          </div>
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-6 pl-4">
            <button
              onClick={(e) => { e.stopPropagation(); setPage("home"); }}
              className={`font-semibold text-sm transition-colors cursor-pointer hover:text-[#064E3B] ${
                activePage === "home"
                  ? "text-[#064E3B] border-b-2 border-[#064E3B] pb-1"
                  : "text-slate-500"
              }`}
            >
              Home
            </button>
            {user && user.role === "user" && (
              <button
                onClick={(e) => { e.stopPropagation(); setPage("sell"); }}
                className={`font-semibold text-sm transition-colors cursor-pointer hover:text-[#064E3B] ${
                  activePage === "sell"
                    ? "text-[#064E3B] border-b-2 border-[#064E3B] pb-1"
                    : "text-slate-500"
                }`}
              >
                Sell Waste
              </button>
            )}
            {user && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPage(user.role === "recycler" ? "dashboard-recycler" : "dashboard-user");
                }}
                className={`font-semibold text-sm transition-colors cursor-pointer hover:text-[#064E3B] ${
                  activePage.startsWith("dashboard")
                    ? "text-[#064E3B] border-b-2 border-[#064E3B] pb-1"
                    : "text-slate-500"
                }`}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Auth / Profile actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Dynamic stats pill in the header matching Sleek theme instructions */}
              {user.role === "user" ? (
                <div className="hidden sm:flex flex-col items-end pr-1 border-r border-slate-100 mr-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Points Balance</span>
                  <span className="text-emerald-600 font-extrabold text-sm">{user.rewardPoints.toLocaleString()} pts</span>
                </div>
              ) : (
                <div className="hidden sm:flex flex-col items-end pr-1 border-r border-slate-100 mr-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Earnings</span>
                  <span className="text-emerald-600 font-extrabold text-sm">₹{(user.earnings || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-7.5 h-7.5 rounded-full object-cover border border-[#064E3B]/20"
                  />
                ) : (
                  <div className="w-7.5 h-7.5 rounded-full bg-[#064E3B] flex items-center justify-center text-white font-extrabold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-slate-400 font-medium capitalize text-[10px]">{user.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-rose-600 font-bold border border-rose-100 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage("login")}
                className="px-5 py-2 rounded-xl font-bold text-sm text-[#064E3B] border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setPage("register")}
                className="px-5 py-2 rounded-xl font-bold text-sm bg-[#064E3B] text-white hover:bg-[#064E3B]/90 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
