import { useState, useEffect } from "react";
import { User, ActivePage } from "./types";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import SellWaste from "./components/SellWaste";
import UserDashboard from "./components/UserDashboard";
import RecyclerDashboard from "./components/RecyclerDashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("w2w-user-session");
    return saved ? JSON.parse(saved) : null;
  });
  const [activePage, setActivePage] = useState<ActivePage>("home");

  // Synchronize state with profile stats from backend regularly
  const handleRefreshUserStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(user.id)}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("w2w-user-session", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to synchronize user stats ledger", err);
    }
  };

  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem("w2w-user-session", JSON.stringify(authenticatedUser));
    
    // Redirect based on role
    if (authenticatedUser.role === "recycler") {
      setActivePage("dashboard-recycler");
    } else {
      setActivePage("dashboard-user");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser(null);
    localStorage.removeItem("w2w-user-session");
    setActivePage("home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans transition-colors duration-300">
      {/* Dynamic Nav bar */}
      <NavBar
        user={user}
        activePage={activePage}
        setPage={(page) => setActivePage(page)}
        onLogout={handleLogout}
      />

      {/* Main Pages Switchboard Section */}
      <main className="flex-grow">
        {activePage === "home" && (
          <Home user={user} setPage={setActivePage} />
        )}

        {activePage === "login" && (
          <Login onLoginSuccess={handleLoginSuccess} setPage={setActivePage} />
        )}

        {activePage === "register" && (
          <Register onRegisterSuccess={handleLoginSuccess} setPage={setActivePage} />
        )}

        {activePage === "sell" && user && user.role === "user" && (
          <SellWaste
            user={user}
            setPage={setActivePage}
            onRequestSubmitted={handleRefreshUserStats}
          />
        )}

        {activePage === "dashboard-user" && user && (
          <UserDashboard
            user={user}
            onRefreshUser={handleRefreshUserStats}
          />
        )}

        {activePage === "dashboard-recycler" && user && (
          <RecyclerDashboard
            recycler={user}
            onRefreshRecycler={handleRefreshUserStats}
          />
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400 space-y-1">
        <p>&copy; {new Date().getFullYear()} Waste2Wealth Exchange. All rights reserved.</p>
        <p className="font-mono text-[9px] max-w-sm mx-auto">
          Built with Express + React. Compiled assets running production container configurations.
        </p>
      </footer>
    </div>
  );
}
