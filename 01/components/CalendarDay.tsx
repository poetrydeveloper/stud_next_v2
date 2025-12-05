//components/CalendarDay
import { DayData } from "../types/calendar";
import { StatusIcon, getStatusLabel } from "./StatusIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CalendarDayProps {
  day: DayData;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CalendarDay({
  day,
  isSelected,
  isHighlighted,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CalendarDayProps) {
  const hasEvents = day.events.length > 0;
  
  // Get top 4 status events (increased from 2)
  const displayEvents = day.events.slice(0, 4);
  
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={`
          relative w-20 h-20 rounded
          flex flex-col items-center justify-between p-1
          cursor-pointer transition-all duration-200
          ${day.isToday 
            ? 'bg-blue-50 border-2 border-blue-500' 
            : day.isCurrentMonth 
              ? 'bg-white border border-gray-200' 
              : 'bg-gray-50 border border-gray-100'
          }
          ${isSelected ? 'ring-2 ring-blue-400' : ''}
          ${isHighlighted ? 'ring-2 ring-purple-400' : ''}
          ${hasEvents && !day.isToday ? 'hover:bg-gray-50' : ''}
        `}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Date Number */}
        <div
          className={`
            text-xs w-full text-center
            ${day.isToday ? 'font-semibold text-blue-700' : ''}
            ${day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
          `}
        >
          {day.date.getDate()}
        </div>
        
        {/* Status Dashboard */}
        {hasEvents && (
          <div className="flex flex-col items-center gap-0.5 w-full">
            {displayEvents.map((event, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1 py-0.5 bg-gray-800/5 rounded w-full justify-center">
                    <StatusIcon status={event.status} size={10} />
                    <span className="text-[10px] text-gray-700">{event.count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>{getStatusLabel(event.status)}: {event.count}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}