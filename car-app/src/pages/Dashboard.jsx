import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import CarCard from "../components/CarCard";
import FilterPanel from "../components/FilterPanel";
import ChatBot from "../components/ChatBot";
import { fetchOptions, searchCars, chatSearch } from "../utils/api";

const LIMIT = 24;

export default function Dashboard() {
  const [options, setOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchOptions().then(setOptions);
  }, []);

  const load = useCallback(async (f, off) => {
    setLoading(true);
    const data = await searchCars(f, LIMIT, off);
    setCars(data.results || []);
    setTotal(data.total || 0);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => { load(filters, offset); }, [filters, offset]);

  const handleFilterChange = (key, val) => {
    setPendingFilters(p => ({ ...p, [key]: val }));
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
    setOffset(0);
  };

  const resetFilters = () => {
    setPendingFilters({});
    setFilters({});
    setSearchVal("");
    setOffset(0);
  };

  const handleSearch = async () => {
    if (!searchVal.trim()) { applyFilters(); return; }
    setSearchLoading(true);
    const data = await chatSearch(searchVal);
    setSearchLoading(false);
    if (data.filters && Object.keys(data.filters).length > 0) {
      setPendingFilters(data.filters);
      setFilters(data.filters);
      setOffset(0);
    } else {
      const f = { ...pendingFilters, q: searchVal };
      setPendingFilters(f);
      setFilters(f);
      setOffset(0);
    }
  };

  const handleChatFilters = (f) => {
    setPendingFilters(f);
    setFilters(f);
    setOffset(0);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Search bar */}
        <div className="flex gap-3 mb-6 max-w-2xl">
          <div className="flex-1 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-500 pointer-events-none">
              <Sparkles size={14} className="text-accent" />
            </div>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Try: 'red Toyota SUV under $20k after 2018'..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-white/7 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl btn-gradient text-white text-sm font-semibold disabled:opacity-70 transition-opacity hover:opacity-90"
          >
            {searchLoading
              ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles size={15} />
                </motion.div>
              : <><Search size={15} /> Search</>
            }
          </button>
        </div>

        <div className="flex gap-6">
          <FilterPanel
            options={options}
            filters={pendingFilters}
            onChange={handleFilterChange}
            onApply={applyFilters}
            onReset={resetFilters}
            open={true}
          />

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                {loading ? "Loading..." : <><span className="text-white font-semibold">{total.toLocaleString()}</span> cars found</>}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 border border-white/5 animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div>
                        <div className="h-3 w-16 bg-white/5 rounded mb-2" />
                        <div className="h-5 w-28 bg-white/5 rounded" />
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5" />
                    </div>
                    <div className="h-7 w-24 bg-white/5 rounded mb-4" />
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 w-16 bg-white/5 rounded-full" />
                      <div className="h-5 w-20 bg-white/5 rounded-full" />
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <div className="text-white font-semibold text-lg mb-2">No cars found</div>
                <div className="text-slate-500 text-sm">Try adjusting your filters or search query</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setOffset(o => Math.max(0, o - LIMIT))}
                  disabled={currentPage === 0}
                  className="w-9 h-9 rounded-xl bg-surface border border-white/7 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                  const page = start + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setOffset(page * LIMIT)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        page === currentPage
                          ? "btn-gradient text-white"
                          : "bg-surface border border-white/7 text-slate-400 hover:text-white"
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => setOffset(o => Math.min((totalPages - 1) * LIMIT, o + LIMIT))}
                  disabled={currentPage >= totalPages - 1}
                  className="w-9 h-9 rounded-xl bg-surface border border-white/7 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatBot onFiltersApplied={handleChatFilters} />
    </div>
  );
}
