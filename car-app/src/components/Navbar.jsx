import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-bg/80 backdrop-blur-xl"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
          <Car size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          Car <span className="gradient-text">APP</span>
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          to="/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            pathname === "/dashboard"
              ? "bg-white/10 text-white"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </Link>
      </div>
    </motion.nav>
  );
}
