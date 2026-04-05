import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Fuel, Gauge, MapPin, Zap, Car, Palette, CheckCircle, Sparkles, User } from "lucide-react";
import Navbar from "../components/Navbar";
import { getCar, getListing } from "../utils/api";
import { getBrandLogo } from "../utils/brandLogos";

const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

const SpecCard = ({ icon, label, value }) => (
  <div className="bg-card border border-white/5 rounded-xl p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-accent flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm text-white font-semibold mt-0.5">{value || "—"}</div>
    </div>
  </div>
);

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [listing, setListing] = useState(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    getCar(id).then(setCar);
    getListing(id)
      .then(data => { setListing(data.listing); setListingLoading(false); })
      .catch(() => setListingLoading(false));
  }, [id]);

  if (!car) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Sparkles size={28} className="text-accent" />
      </motion.div>
    </div>
  );

  const logo = getBrandLogo(car.manufacturer);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to results
        </button>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 btn-gradient" />
          {/* Glow orb */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex-1">
              <div className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">
                {car.manufacturer}
              </div>
              <h1 className="text-4xl font-black text-white capitalize leading-tight mb-2">
                {car.model}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm">{car.year}</span>
                {car.condition && (
                  <span className={`px-3 py-1 rounded-full text-sm border ${
                    car.condition === "new" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    car.condition === "like new" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-white/5 text-slate-400 border-white/10"
                  }`}>{cap(car.condition)}</span>
                )}
                {car.state && (
                  <span className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={13} /> {car.state.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-5xl font-black gradient-text">${car.price.toLocaleString()}</div>
            </div>

            {/* Brand logo */}
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {logo && !logoError ? (
                <img src={logo} alt={car.manufacturer} className="w-14 h-14 object-contain"
                  onError={() => setLogoError(true)} />
              ) : (
                <span className="text-4xl font-black text-white/20">{car.manufacturer?.[0]}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Specs grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6"
        >
          <SpecCard icon={<Gauge size={16} />} label="Mileage" value={car.odometer ? `${car.odometer.toLocaleString()} mi` : null} />
          <SpecCard icon={<Fuel size={16} />} label="Fuel" value={cap(car.fuel)} />
          <SpecCard icon={<Zap size={16} />} label="Transmission" value={cap(car.transmission)} />
          <SpecCard icon={<Car size={16} />} label="Drive" value={car.drive?.toUpperCase()} />
          <SpecCard icon={<Car size={16} />} label="Type" value={cap(car.type)} />
          <SpecCard icon={<Palette size={16} />} label="Color" value={cap(car.paint_color)} />
        </motion.div>

        {/* AI Listing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold">AI-Generated Listing</div>
              <div className="text-xs text-slate-500">Written by GPT-4o</div>
            </div>
          </div>

          {listingLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-white/5 rounded-xl w-3/4" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-5/6" />
              <div className="h-4 bg-white/5 rounded w-4/5" />
            </div>
          ) : listing ? (
            <div className="space-y-6">
              {/* Tagline */}
              <div className="text-xl font-bold text-white">"{listing.tagline}"</div>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed text-sm">{listing.description}</p>

              {/* Highlights */}
              {listing.highlights?.length > 0 && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Highlights</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listing.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-accent mt-0.5 flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideal for */}
              {listing.ideal_for && (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="text-xs text-blue-400 uppercase tracking-widest mb-1">Ideal For</div>
                  <div className="text-sm text-slate-300">{listing.ideal_for}</div>
                </div>
              )}

              {/* Seller note */}
              {listing.seller_note && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Seller's Note</div>
                    <div className="text-sm text-slate-400 italic">"{listing.seller_note}"</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-sm">Could not generate listing.</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
