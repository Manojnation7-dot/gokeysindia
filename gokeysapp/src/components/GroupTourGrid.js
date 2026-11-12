"use client";

import { useMemo, useState } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
  "November", "December"];
const monthLabel = (ym) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;

// Tour cards on /grouptour with month and destination filters, in the browser. The cards themselves are rendered
// on the server (passed in as `node`), so the page's HTML is the same for search engines.
// cards: [{ id, months: ["2027-05", ...], destinations: ["Kedarnath", ...], node }]
export default function GroupTourGrid({ cards }) {
  const [month, setMonth] = useState("");
  const [place, setPlace] = useState("");
  const months = useMemo(() => [...new Set(cards.flatMap((c) => c.months))].sort(), [cards]);
  const places = useMemo(() => [...new Set(cards.flatMap((c) => c.destinations))].sort((a, b) => a.localeCompare(b)), [cards]);
  const shown = cards.filter((c) => (!month || c.months.includes(month)) && (!place || c.destinations.includes(place)));
  const filtering = Boolean(month || place);

  return (
    <>
      {(months.length > 1 || places.length > 1) && (
        <div className="mb-5 flex flex-wrap items-end gap-3" role="search" aria-label="Filter group tours">
          {months.length > 1 && (
            <label className="text-sm"><span className="gk-label">Month</span>
              <select className="gk-field min-w-40" value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Any month</option>
                {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
            </label>
          )}
          {places.length > 1 && (
            <label className="text-sm"><span className="gk-label">Destination</span>
              <select className="gk-field min-w-40" value={place} onChange={(e) => setPlace(e.target.value)}>
                <option value="">Any destination</option>
                {places.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          )}
          {filtering && (
            <button type="button" className="gk-btn gk-btn-line py-2!" onClick={() => { setMonth(""); setPlace(""); }}>Clear filters</button>
          )}
          <p className="text-sm text-slate-ink ml-auto" aria-live="polite">{shown.length} of {cards.length} tours</p>
        </div>
      )}
      {shown.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shown.map((c) => <div key={c.id}>{c.node}</div>)}
        </div>
      ) : (
        <p className="gk-panel p-5 text-ink">No group tour matches these filters. <button type="button" className="underline"
          onClick={() => { setMonth(""); setPlace(""); }}>Show all tours</button></p>
      )}
    </>
  );
}
