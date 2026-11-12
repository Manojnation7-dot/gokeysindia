"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatDepartureDate, todayIST } from "@/lib/departures";

// "Upcoming dates" on /grouptour: soonest first, with each date's status badge. A date that passes while the page is
// cached is dropped in the browser (the first render uses the server's time, so the HTML matches; no layout jump
// beyond removing that row).
// rows: [{ key, date, tourName, slug, badge, badgeLabel, label, seatsLeft, bookable, bookOnline, price (node) }]
export default function UpcomingDatesTable({ rows, renderedAt }) {
  const [today, setToday] = useState(() => todayIST(new Date(renderedAt || Date.now())));
  useEffect(() => setToday(todayIST(new Date())), []);
  const shown = rows.filter((r) => r.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);
  if (!shown.length) return null;
  return (
    <div className="mt-12">
      <h2 className="gk-h2 mb-5">Upcoming dates</h2>
      <div className="gk-card overflow-x-auto">
        <table className="w-full text-sm min-w-140">
          <thead className="bg-ink text-white text-left">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Trip</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3"><span className="sr-only">Book or reserve</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.key} className="border-t border-line">
                <td className="px-5 py-3 font-bold text-ink whitespace-nowrap">{formatDepartureDate(r.date)}</td>
                <td className="px-5 py-3 font-semibold text-ink">{r.tourName}</td>
                <td className="px-5 py-3">
                  <span className="flex flex-wrap gap-1.5">
                    {r.badge ? <StatusBadge kind={r.badge} label={r.badgeLabel} /> : <span className="gk-chip">{r.label}</span>}
                    {r.bookable && r.seatsLeft != null && <span className="gk-chip">{r.seatsLeft} left</span>}
                  </span>
                </td>
                <td className="px-5 py-3">{r.price}</td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/grouptour/${r.slug}#departures`} className={`gk-btn py-2! ${r.bookOnline ? "gk-btn-sun" : "gk-btn-ink"}`}
                    aria-label={`${r.bookOnline ? "Book" : r.bookable ? "Reserve" : "View"} ${r.tourName}, ${formatDepartureDate(r.date)}`}>
                    {r.bookOnline ? "Book now" : r.bookable ? "Reserve" : "View"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
