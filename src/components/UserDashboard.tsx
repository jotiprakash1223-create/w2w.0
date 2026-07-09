import { useEffect, useState } from "react";
import { Award, Leaf, Droplet, Sparkles, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";
import { User, WasteRequest } from "../types";

interface UserDashboardProps {
  user: User;
  onRefreshUser: () => void;
}

export default function UserDashboard({ user, onRefreshUser }: UserDashboardProps) {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/requests?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to load user requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    onRefreshUser(); // Dynamic state refresh
  }, [user.id]);

  const getStatusStyle = (status: WasteRequest["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Collected":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-250";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getCategoryColor = (type: WasteRequest["wasteType"]) => {
    switch (type) {
      case "Plastic": return "bg-emerald-50 text-emerald-700 border-emerald-150";
      case "Paper": return "bg-sky-50 text-sky-700 border-sky-150";
      case "Cardboard": return "bg-amber-50 text-amber-700 border-amber-150";
      case "Metal": return "bg-indigo-50 text-indigo-700 border-indigo-150";
      case "E-Waste": return "bg-purple-50 text-purple-700 border-purple-150";
      default: return "bg-slate-50 text-slate-700 border-slate-150";
    }
  };

  // Group stats for clean visualization!
  const stats = [
    {
      title: "Reward points Balance",
      value: `${user.rewardPoints.toLocaleString()} pts`,
      desc: "Redeemable for eco-store vouchers",
      icon: <Award className="w-5 h-5 text-amber-600" />,
      bubbleBg: "bg-amber-50 border-amber-100/50"
    },
    {
      title: "CO2 prevented",
      value: `${user.co2Saved.toLocaleString()} kg`,
      desc: "Carbon footprint displaced",
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
      bubbleBg: "bg-emerald-50 border-emerald-100/50"
    },
    {
      title: "Trees equivalent",
      value: `${user.treesPlanted} Trees`,
      desc: "Carbon absorption offset matched",
      icon: <Sparkles className="w-5 h-5 text-teal-600" />,
      bubbleBg: "bg-teal-50 border-teal-100/50"
    },
    {
      title: "Water saved",
      value: `${user.waterSaved.toLocaleString()} L`,
      desc: "Water conservation equivalent",
      icon: <Droplet className="w-5 h-5 text-blue-600" />,
      bubbleBg: "bg-blue-50 border-blue-100/50"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-[85vh] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Eco-Producer Portal</h1>
            <p className="text-sm text-slate-500">Track points, scheduling details, and environmental metrics.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-250">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Elite Green Partner - Level 3
          </div>
        </div>

        {/* Dynamic Bento Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className={`p-3 rounded-2xl border ${s.bubbleBg} shadow-sm`}>
                  {s.icon}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Impact Metric</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-2.5xl font-extrabold text-slate-900 font-mono tracking-tight">{s.value}</p>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{s.title}</p>
                <p className="text-[10px] text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main requests queue */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Collection Schedules</h2>
              <p className="text-xs text-slate-400">Logistics tracking of your submitted waste transactions</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-slate-500 animate-pulse">
              Retrieving transactional logs from ledger...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-slate-500">No scheduled pickups located.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4">TransID</th>
                    <th className="py-4">Waste Type</th>
                    <th className="py-4">Est. Quantity</th>
                    <th className="py-4">Pickup Date</th>
                    <th className="py-4">Pickup Address</th>
                    <th className="py-4">Logistics Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 font-mono text-xs font-bold text-slate-400">{r.id}</td>
                      <td className="py-4.5">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getCategoryColor(r.wasteType)}`}>
                          {r.wasteType}
                        </span>
                      </td>
                      <td className="py-4.5 font-mono font-bold text-slate-700">{r.quantity} kg</td>
                      <td className="py-4.5 font-mono text-xs text-slate-500">{r.preferredPickupDate}</td>
                      <td className="py-4.5 text-xs text-slate-500 max-w-[200px] truncate" title={r.pickupAddress}>
                        {r.pickupAddress}
                      </td>
                      <td className="py-4.5">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 w-fit ${getStatusStyle(r.status)}`}>
                          {r.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                          {r.status === "Accepted" && <Clock className="w-3.5 h-3.5" />}
                          {r.status === "Collected" && <Clock className="w-3.5 h-3.5 animate-spin-slow" />}
                          {r.status === "Completed" && <CheckCircle className="w-3.5 h-3.5" />}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
