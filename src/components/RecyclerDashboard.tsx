import { useEffect, useState } from "react";
import { Shield, Sparkles, Droplet, IndianRupee, MapPin, Calendar, Check, Truck, CheckCircle2, Phone, Filter } from "lucide-react";
import { User, WasteRequest } from "../types";

interface RecyclerDashboardProps {
  recycler: User;
  onRefreshRecycler: () => void;
}

export default function RecyclerDashboard({ recycler, onRefreshRecycler }: RecyclerDashboardProps) {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "Accepted" | "Collected" | "Completed">("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchGlobalRequests = async () => {
    try {
      const res = await fetch(`/api/requests?role=recycler`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to load recycler log metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalRequests();
    onRefreshRecycler();
  }, [recycler.id]);

  const handleUpdateStatus = async (requestId: string, nextStatus: WasteRequest["status"]) => {
    setUpdatingId(requestId);
    try {
      const res = await fetch(`/api/requests/${encodeURIComponent(requestId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, recyclerId: recycler.id })
      });

      if (res.ok) {
        // Optimistically update list in state
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: nextStatus } : r));
        onRefreshRecycler(); // Fetch updated earnings/metrics
      }
    } catch (err) {
      console.error("Error updating request tracking logs", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = dRequests();

  function dRequests() {
    if (filter === "All") return requests;
    return requests.filter(r => r.status === filter);
  }

  const getStatusStyle = (status: WasteRequest["status"]) => {
    switch (status) {
      case "Pending": return "bg-amber-105 text-amber-80 * 10 border border-amber-20";
      case "Accepted": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Collected": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed": return "bg-emerald-100 text-emerald-800 border-emerald-250";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
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

  // Recycler statistics
  const metrics = [
    {
      title: "Logistics Earnings",
      value: recycler.earnings ? `₹${recycler.earnings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "₹0.00",
      desc: "Based on ₹0.85/kg processing pay",
      icon: <IndianRupee className="w-5 h-5 text-emerald-600" />,
      bubbleBg: "bg-emerald-50 border-emerald-100/50"
    },
    {
      title: "Total CO2 Restored",
      value: recycler.co2Saved ? `${(recycler.co2Saved / 1000).toFixed(1)} Tons` : "0.0 Tons",
      desc: "Bulk recycling footprint prevention",
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
      bubbleBg: "bg-indigo-50 border-indigo-100/50"
    },
    {
      title: "Trees Planted equiv",
      value: `${recycler.treesPlanted || 0} Trees`,
      desc: "Reforestation offset credits earned",
      icon: <Sparkles className="w-5 h-5 text-teal-600" />,
      bubbleBg: "bg-teal-50 border-teal-100/50"
    },
    {
      title: "Water Saved equiv",
      value: recycler.waterSaved ? `${recycler.waterSaved.toLocaleString()} L` : "0 L",
      desc: "Manufacturing water displacement",
      icon: <Droplet className="w-5 h-5 text-blue-600" />,
      bubbleBg: "bg-blue-50 border-blue-100/50"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-[85vh] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recycling Partner Console</h1>
            <p className="text-sm text-slate-500">
              Operations portal for <strong className="text-emerald-800">{recycler.companyName}</strong> (Rating: {recycler.rating})
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-lg border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Verified Regional Operator
          </div>
        </div>

        {/* Aggregate Logistics stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className={`p-3 rounded-2xl border ${m.bubbleBg} shadow-sm`}>
                  {m.icon}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Logistics</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-2.5xl font-extrabold text-slate-900 font-mono tracking-tight">{m.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{m.title}</p>
                <p className="text-[10px] text-slate-400">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Regional pickups ledger */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Regional Collection Ledger</h2>
              <p className="text-xs text-slate-400">Track and fulfill solid waste collection schedules in the zone</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-250 shrink-0 overflow-x-auto max-w-full">
              {(["All", "Pending", "Accepted", "Collected", "Completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filter === tab
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400 animate-pulse font-mono">
              Synchronizing with local municipal waste grids...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No regional requests found matching status: <strong className="capitalize">{filter}</strong>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4">TransID</th>
                    <th className="py-4">Seller/Producer</th>
                    <th className="py-4">Waste Category</th>
                    <th className="py-4">Weight</th>
                    <th className="py-4">Pickup Date</th>
                    <th className="py-4">Pickup Address & Contact</th>
                    <th className="py-4 text-center">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 font-mono text-xs font-bold text-slate-400">{r.id}</td>
                      <td className="py-4.5 font-semibold text-slate-800">{r.userName}</td>
                      <td className="py-4.5">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getCategoryColor(r.wasteType)}`}>
                          {r.wasteType}
                        </span>
                      </td>
                      <td className="py-4.5 font-mono font-bold text-slate-700">{r.quantity} kg</td>
                      <td className="py-4.5 font-mono text-xs text-slate-500">{r.preferredPickupDate}</td>
                      <td className="py-4.5 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-slate-600 max-w-[200px] truncate" title={r.pickupAddress}>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {r.pickupAddress}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          {r.contactNumber}
                        </div>
                      </td>
                      <td className="py-4.5 flex justify-center items-center">
                        {updatingId === r.id ? (
                          <span className="text-xs text-slate-400 animate-pulse">Updating logs...</span>
                        ) : r.status === "Pending" ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id, "Accepted")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept Request
                          </button>
                        ) : r.status === "Accepted" ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id, "Collected")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Mark Collected
                          </button>
                        ) : r.status === "Collected" ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id, "Completed")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Fulfill & Complete
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-800 text-xs font-semibold bg-emerald-50 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Fulfilled
                          </span>
                        )}
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
