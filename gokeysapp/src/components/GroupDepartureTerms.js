import TERMS from "@/lib/groupDepartureTerms.json";

// Fixed-departure group tour rules, from the single source (src/lib/groupDepartureTerms.json, also used by the
// voucher PDF). Used on the Terms page, the cancellation policy, the checkout and the departure cards.
const SECTIONS = [
  ["payment", "Advance and balance"],
  ["cancellation", "If you cancel"],
  ["minimumGroup", "Minimum group size"],
];

export default function GroupDepartureTerms({ only, headingClass = "font-semibold text-ink mt-3", listClass = "list-disc pl-6 space-y-1" }) {
  return SECTIONS.filter(([key]) => !only || only.includes(key)).map(([key, title]) => (
    <div key={key}>
      {!only || only.length > 1 ? <p className={headingClass}>{title}</p> : null}
      <ul className={listClass}>
        {TERMS[key].map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  ));
}

export { TERMS as GROUP_DEPARTURE_TERMS };
