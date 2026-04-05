import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Fuel, Gauge, MapPin, Zap } from "lucide-react";
import { getBrandLogo } from "../utils/brandLogos";

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

export default function CarCard({ car, index = 0 }) {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const logo = getBrandLogo(car.manufacturer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/car/${car.id}`)}
      className="group relative bg-card rounded-2xl p-5 cursor-pointer glow-card transition-all duration-300 border border-white/5 hover:border-accent/30 overflow-hidden"
    >
      {/* Subtle gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 btn-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Brand logo */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">
            {car.manufacturer}
          </span>
          <h3 className="text-white font-bold text-base leading-tight mt-0.5 capitalize line-clamp-1">
            {car.model}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ml-2">
          {logo && !logoError ? (
            <img
              src={logo}
              alt={car.manufacturer}
              className="w-6 h-6 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-white font-bold text-sm">
              {car.manufacturer?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Price + Year */}
      <div className="flex items-end justify-between mb-4">
        <div className="text-2xl font-black text-white">
          ${car.price.toLocaleString()}
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-xs font-semibold border border-white/5">
          {car.year}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {car.fuel && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
            <Fuel size={10} /> {cap(car.fuel)}
          </span>
        )}
        {car.transmission && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20">
            <Zap size={10} /> {cap(car.transmission)}
          </span>
        )}
        {car.type && (
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-medium border border-white/5">
            {cap(car.type)}
          </span>
        )}
      </div>

      {/* Footer details */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
        {car.odometer ? (
          <span className="flex items-center gap-1">
            <Gauge size={11} /> {car.odometer.toLocaleString()} mi
          </span>
        ) : <span />}
        {car.state && (
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {car.state.toUpperCase()}
          </span>
        )}
        {car.condition && (
          <span className={`capitalize px-2 py-0.5 rounded-full text-xs border ${
            car.condition === "new" ? "bg-green-500/10 text-green-400 border-green-500/20" :
            car.condition === "like new" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            car.condition === "excellent" ? "bg-teal-500/10 text-teal-400 border-teal-500/20" :
            "bg-white/5 text-slate-400 border-white/5"
          }`}>
            {cap(car.condition)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
