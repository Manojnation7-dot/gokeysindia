// One status badge per departure date, worked out by the backend (thresholds in the admin's Group tour settings).
const STYLES = {
  open: "bg-teal-50! text-teal-800!",
  filling_fast: "gk-chip-sun",
  few_left: "bg-red-50! text-red-800!",
  guaranteed: "bg-green-50! text-green-800!",
  sold_out: "bg-slate-200! text-slate-700!",
  enquiry: "",
};

export default function StatusBadge({ kind, label }) {
  if (!kind || !label) return null;
  return <span className={`gk-chip ${STYLES[kind] ?? ""}`}>{label}</span>;
}
