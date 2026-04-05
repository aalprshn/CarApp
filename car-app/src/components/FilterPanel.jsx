import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Select = ({ label, id, options, value, onChange }) => (
  <div>
    <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
    <select
      value={value}
      onChange={e => onChange(id, e.target.value)}
      className="w-full bg-surface border border-white/7 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accent/50 transition-colors"
    >
      <option value="">All</option>
      {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
    </select>
  </div>
);

const RangeInput = ({ label, idMin, idMax, placeholderMin, placeholderMax, values, onChange }) => (
  <div>
    <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="flex gap-2">
      <input type="number" placeholder={placeholderMin} value={values[idMin] || ""}
        onChange={e => onChange(idMin, e.target.value)}
        className="w-1/2 bg-surface border border-white/7 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accent/50 transition-colors" />
      <input type="number" placeholder={placeholderMax} value={values[idMax] || ""}
        onChange={e => onChange(idMax, e.target.value)}
        className="w-1/2 bg-surface border border-white/7 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accent/50 transition-colors" />
    </div>
  </div>
);

export default function FilterPanel({ options, filters, onChange, onApply, onReset, open, onToggle }) {
  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/7 text-sm text-slate-300 hover:text-white transition-colors mb-4"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      <AnimatePresence>
        {(open || true) && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col gap-4 w-56 flex-shrink-0"
          >
            <div className="glass rounded-2xl p-5 flex flex-col gap-4 sticky top-20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Filters
                </span>
                <button onClick={onReset} className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                  <X size={12} /> Reset
                </button>
              </div>

              <Select label="Make" id="manufacturer" options={options.manufacturers || []} value={filters.manufacturer || ""} onChange={onChange} />
              <RangeInput label="Year" idMin="year_min" idMax="year_max" placeholderMin="From" placeholderMax="To" values={filters} onChange={onChange} />
              <RangeInput label="Price ($)" idMin="price_min" idMax="price_max" placeholderMin="Min" placeholderMax="Max" values={filters} onChange={onChange} />

              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">Max Mileage</label>
                <input type="number" placeholder="e.g. 100000" value={filters.odometer_max || ""}
                  onChange={e => onChange("odometer_max", e.target.value)}
                  className="w-full bg-surface border border-white/7 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>

              <Select label="Fuel" id="fuel" options={options.fuels || []} value={filters.fuel || ""} onChange={onChange} />
              <Select label="Transmission" id="transmission" options={options.transmissions || []} value={filters.transmission || ""} onChange={onChange} />
              <Select label="Condition" id="condition" options={options.conditions || []} value={filters.condition || ""} onChange={onChange} />
              <Select label="Drive" id="drive" options={options.drives || []} value={filters.drive || ""} onChange={onChange} />
              <Select label="Type" id="type" options={options.types || []} value={filters.type || ""} onChange={onChange} />
              <Select label="Color" id="paint_color" options={options.colors || []} value={filters.paint_color || ""} onChange={onChange} />
              <Select label="State" id="state" options={options.states || []} value={filters.state || ""} onChange={onChange} />

              <button
                onClick={onApply}
                className="w-full py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold transition-opacity hover:opacity-90 mt-1"
              >
                Apply Filters
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
