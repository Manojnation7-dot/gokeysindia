import CabCard from "@/components/CabsCard";
import { cabs } from "@/lib/cabs";

// Every cab on the /cabs page (the fleet lives in lib/cabs.js, shared with the home page).
export default function CabList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cabs.map((cab) => (
        <CabCard key={cab.id} cab={cab} />
      ))}
    </div>
  );
}
