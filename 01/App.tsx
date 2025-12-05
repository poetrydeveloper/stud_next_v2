//app.tsx
import { useState } from "react";
import { CalendarDay } from "./components/CalendarDay";
import { ConnectionLines } from "./components/ConnectionLines";
import { CalendarLegend } from "./components/CalendarLegend";
import { ProductDetails } from "./components/ProductDetails";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  generateCalendarDays,
  generateConnections,
  mockProductUnits,
} from "./utils/calendarData";
import { DayData } from "./types/calendar";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 21)); // November 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredProductIds, setHoveredProductIds] = useState<Set<string>>(new Set());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = generateCalendarDays(year, month);
  const connections = generateConnections();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day: DayData) => {
    setSelectedDate(day.date);
  };

  const handleDayHover = (day: DayData) => {
    if (day.events.length === 0) return;
    
    const productIds = new Set<string>();
    day.events.forEach((event) => {
      event.productIds.forEach((id) => productIds.add(id));
    });
    
    setHoveredProductIds(productIds);
  };

  const handleDayLeave = () => {
    setHoveredProductIds(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900">Product Unit Tracker</h1>
            <p className="text-slate-600 mt-1">
              Track product status changes with visual connections
            </p>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarLegend />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="w-20 h-8 flex items-center justify-center text-xs text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid Container */}
                <div className="relative">
                  {/* Connection Lines Layer */}
                  <div className="absolute inset-0" style={{ zIndex: 0 }}>
                    <ConnectionLines
                      connections={connections}
                      calendarDays={calendarDays}
                      highlightedProductIds={hoveredProductIds}
                    />
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="relative grid grid-cols-7 gap-1" style={{ zIndex: 1 }}>
                    {calendarDays.map((day, index) => {
                      const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                      const isHighlighted = day.events.some((event) =>
                        event.productIds.some((id) => hoveredProductIds.has(id))
                      );

                      return (
                        <CalendarDay
                          key={index}
                          day={day}
                          isSelected={isSelected}
                          isHighlighted={isHighlighted}
                          onClick={() => handleDayClick(day)}
                          onMouseEnter={() => handleDayHover(day)}
                          onMouseLeave={handleDayLeave}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Hover over days with events to highlight product chains. Click to view details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details Panel */}
          <div className="lg:col-span-1">
            <ProductDetails
              products={mockProductUnits}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}