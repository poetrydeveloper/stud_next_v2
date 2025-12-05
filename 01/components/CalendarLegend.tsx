//components/CalendarLegend
import { ProductStatus } from "../types/calendar";
import { StatusIcon, getStatusLabel } from "./StatusIcon";

const statuses: ProductStatus[] = ["CLEAR", "CANDIDATE", "IN_REQUEST", "IN_STORE", "SOLD"];

export function CalendarLegend() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-1.5">
          <StatusIcon status={status} size={12} />
          <span className="text-xs text-gray-600">{getStatusLabel(status)}</span>
        </div>
      ))}
    </div>
  );
}
