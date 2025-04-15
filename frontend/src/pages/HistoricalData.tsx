
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHistoricalData, filterDataByDateRange, calculateAverages } from "@/hooks/useEnvironmentalData";
import HistoricalChart from "@/components/Charts/HistoricalChart";
import { DateRange } from "@/types/types";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, addDays } from "date-fns";

const HistoricalData = () => {
  const { data: historicalData, isLoading } = useHistoricalData();
  
  // Default date range is last 7 days
  const today = new Date();
  const oneWeekAgo = subDays(today, 7);
  
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: oneWeekAgo,
    endDate: today,
  });
  
  // State to track the calendar selection phase
  const [selectionState, setSelectionState] = useState<'start' | 'end'>('start');
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Filter data by selected date range
  const filteredData = filterDataByDateRange(historicalData, dateRange);
  
  // Calculate averages from filtered data
  const averages = historicalData ? calculateAverages({
    data: filteredData,
  }) : { avgTemperature: 0, avgHumidity: 0, avgMoisture: 0 };

  // Handler for preset date ranges
  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setDateRange({
      startDate: start,
      endDate: end,
    });
  };

  // Improved handler for calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (selectionState === 'start') {
      // First selection sets the start date
      setDateRange({
        startDate: date,
        endDate: addDays(date, 7), // Default to 7 days from selected date
      });
      setSelectionState('end');
    } else {
      // Second selection sets the end date
      // Ensure end date is after start date
      if (date < dateRange.startDate) {
        setDateRange({
          startDate: date,
          endDate: dateRange.startDate,
        });
      } else {
        setDateRange({
          ...dateRange,
          endDate: date,
        });
      }
      setSelectionState('start');
      setCalendarOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 sm:mb-0">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Historical Environmental Data</h1>
          <p className="text-muted-foreground">
            Analyze historical trends and patterns in your environmental data
          </p>
        </div>

        {/* Date Range Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range Selection</CardTitle>
            <CardDescription>
              Select a date range to view historical data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Quick Filters</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePresetRange(7)}
                  >
                    Last 7 Days
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePresetRange(14)}
                  >
                    Last 14 Days
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePresetRange(30)}
                  >
                    Last 30 Days
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Custom Range</p>
                <div className="flex items-center gap-2">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal w-[240px]"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.startDate && dateRange.endDate ? (
                          <span>
                            {format(dateRange.startDate, "MMM d, yyyy")} - {format(dateRange.endDate, "MMM d, yyyy")}
                          </span>
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <div className="p-2 text-center border-b">
                        <p className="text-sm font-medium">
                          {selectionState === 'start' 
                            ? 'Select start date' 
                            : 'Select end date'}
                        </p>
                      </div>
                      <Calendar
                        mode="single"
                        selected={selectionState === 'start' ? dateRange.startDate : dateRange.endDate}
                        onSelect={handleCalendarSelect}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Data Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Data History</CardTitle>
            <CardDescription>
              Data from {format(dateRange.startDate, "MMM d, yyyy")} to {format(dateRange.endDate, "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HistoricalChart 
              data={filteredData}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Average Values for Selected Period */}
        <Card>
          <CardHeader>
            <CardTitle>Average Values for Selected Period</CardTitle>
            <CardDescription>
              Summary statistics for the selected date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-muted-foreground text-sm">Average Temperature</p>
                <p className="text-2xl font-bold text-orange-600">{averages.avgTemperature}°C</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-muted-foreground text-sm">Average Humidity</p>
                <p className="text-2xl font-bold text-blue-600">{averages.avgHumidity}%</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-muted-foreground text-sm">Average Soil Moisture</p>
                <p className="text-2xl font-bold text-amber-600">{averages.avgMoisture}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoricalData;
