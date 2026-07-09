import React, { useState } from "react";
import { Plus, Award, Leaf, Info, Calendar, MapPin, Phone, HelpCircle } from "lucide-react";
import { User, ActivePage } from "../types";

interface SellWasteProps {
  user: User;
  setPage: (page: ActivePage) => void;
  onRequestSubmitted: () => void;
}

export default function SellWaste({ user, setPage, onRequestSubmitted }: SellWasteProps) {
  const [wasteType, setWasteType] = useState<'Plastic' | 'Paper' | 'Cardboard' | 'Glass' | 'Metal' | 'E-Waste' | 'Mixed'>("Plastic");
  const [quantity, setQuantity] = useState(15);
  const [pickupAddress, setPickupAddress] = useState("");
  const [contactNumber, setContactNumber] = useState(user.phone || "");
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Dynamic calculations based on user input!
  const estPoints = Math.round(quantity * 10);
  const estCO2 = (quantity * 2.4).toFixed(1);
  const estCash = (quantity * 0.85).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          wasteType,
          quantity,
          pickupAddress,
          contactNumber,
          preferredPickupDate: preferredDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setMessage("Request scheduled successfully with our recyclers!");
      setTimeout(() => {
        onRequestSubmitted();
        setPage("dashboard-user");
      }, 1500);
    } catch (err: any) {
      setMessage(`Error: ${err.message || "Failed to post request"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sell Your Recyclables</h1>
          <p className="text-sm text-slate-500">Provide pickup parameters to earn reward points immediately.</p>
        </div>

        {message && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-semibold border border-emerald-150 shadow-sm animate-pulse">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Main Form Entry */}
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            {/* Waste Categories selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Waste Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["Plastic", "Paper", "Cardboard", "Glass", "Metal", "E-Waste", "Mixed"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWasteType(cat)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl text-center border transition-all cursor-pointer ${
                      wasteType === cat
                        ? "bg-[#064E3B] text-white border-[#064E3B]"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Approximate Quantity Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Approximate Quantity</span>
                <span className="text-[#064E3B] font-mono text-sm uppercase">{quantity} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-[#064E3B]/10 rounded-lg appearance-none cursor-pointer accent-[#064E3B]"
              />
              <p className="text-[10px] text-slate-400 italic">
                Our collectors weigh your cargo on-site with certified calibration scales before confirming rewards.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Pickup Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Pickup address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder=" Visakhapatnam, Andhra Pradesh"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Contact phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Contact phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                    />
                  </div>
                </div>

                {/* Date Picker */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Preferred pickup date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#064E3B] text-white font-bold hover:bg-[#064E3B]/95 rounded-xl text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? "Scheduling pickup..." : "Request Eco-Pickup"}
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* Real-time Economic Calculator Summary Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#064E3B] text-white rounded-3xl p-6 shadow-md space-y-5 border border-emerald-950">
              <h3 className="font-bold text-lg border-b border-emerald-800 pb-3">
                Estimation Calculator
              </h3>

              <div className="space-y-4">
                {/* Reward points */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#064E3B]/60 rounded-xl text-emerald-200 border border-emerald-800/40">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-250 uppercase font-semibold">Reward Points</p>
                    <p className="text-lg font-mono font-black text-emerald-100">+{estPoints} pts</p>
                  </div>
                </div>

                {/* Carbon displacement */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#064E3B]/60 rounded-xl text-emerald-200 border border-emerald-800/40">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-250 uppercase font-semibold">CO2 Prevented</p>
                    <p className="text-lg font-mono font-black text-emerald-100">{estCO2} kg</p>
                  </div>
                </div>

                {/* Expected currency equivalent */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#064E3B]/60 rounded-xl text-emerald-200 border border-emerald-800/40">
                    <span className="p-0.5 font-bold font-mono h-5 w-5 bg-[#064E3B]/90 rounded-full flex items-center justify-center text-xs text-emerald-150">
                      ₹
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-250 uppercase font-semibold">Pre-Tax Market Value</p>
                    <p className="text-lg font-mono font-black text-emerald-100">₹{estCash}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#064E3B]/70 p-4 rounded-2xl text-xs text-emerald-200 leading-normal flex gap-2 border border-emerald-800/40">
                <Info className="w-5 h-5 flex-shrink-0 text-emerald-350" />
                <span>
                  Exact payments and environmental tallies recalculate using real scaled weight values during our verified recycler pickup logs.
                </span>
              </div>
            </div>

            {/* Recycling FAQ checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-50">
                <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                Recycler Instructions
              </h4>
              <ul className="text-xs text-slate-500 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] mt-1.5 flex-shrink-0" />
                  <span><strong>Clean Waste</strong>: Avoid leaving organic liquids, grease or toxic chemistry inside plastic or metal containers to prevent collection bypass.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] mt-1.5 flex-shrink-0" />
                  <span><strong>E-Waste Protocol</strong>: Remove custom memory cards, sim chips and lithium chargers before scheduling general computer pickups.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
