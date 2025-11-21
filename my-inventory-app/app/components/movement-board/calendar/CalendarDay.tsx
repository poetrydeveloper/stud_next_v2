import { StatusColors } from "./statusMap"

export default function CalendarDay({ day }: any) {
  const { date, events } = day

  return (
    <div className="bg-gray-50 p-2 h-20 relative rounded text-[10px]">
      <div className="text-gray-700 font-medium">{date.getDate()}</div>

      <div className="absolute inset-0 flex items-center justify-center gap-1">
        {events.map((e: any, i: number) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: StatusColors[e.status] }}
          />
        ))}
      </div>
    </div>
  )
}
