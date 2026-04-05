import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Database, Zap } from "lucide-react";

const stats = [
  { value: "350K+", label: "Listings" },
  { value: "AI", label: "Powered Search" },
  { value: "Free", label: "No Sign-up" },
];

const features = [
  {
    icon: <Search size={20} className="text-blue-400" />,
    title: "Smart Filters",
    desc: "Filter by make, model, year, price, mileage, fuel type, and more.",
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    icon: <Sparkles size={20} className="text-violet-400" />,
    title: "AI Chat Search",
    desc: "Just describe what you want in plain English. Our AI does the rest.",
    color: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20",
  },
  {
    icon: <Database size={20} className="text-emerald-400" />,
    title: "350K+ Real Listings",
    desc: "Real Craigslist data — cars across all 50 states, every budget.",
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: <Zap size={20} className="text-amber-400" />,
    title: "AI Listing Details",
    desc: "Click any car for a full AI-generated listing with highlights and specs.",
    color: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg hero-glow grid-bg relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="font-bold text-lg text-white">Car <span className="gradient-text">APP</span></span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/7 hover:border-white/20 transition-all"
        >
          Dashboard <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8"
        >
          <Sparkles size={12} /> AI-Powered Car Search
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none mb-6"
        >
          Find Your <br />
          <span className="gradient-text">Perfect Car</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
        >
          Search 350,000+ real listings with smart filters or just chat with our AI — it understands plain English.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl btn-gradient text-white font-semibold text-base glow-blue transition-all hover:scale-105 active:scale-95"
          >
            Start Searching <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-10 mt-16"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black gradient-text">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} backdrop-blur-sm`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl btn-gradient text-white font-semibold text-base mx-auto glow-blue hover:scale-105 transition-transform active:scale-95"
          >
            Browse All Cars <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
