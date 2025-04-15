
import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Brush
} from "recharts";
import { SensorData } from "@/types/types";
import { format, parseISO } from "date-fns";

interface HistoricalChartProps {
  data: SensorData[];
  isLoading: boolean;
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, isLoading }) => {
  const [activeLines, setActiveLines] = useState({
    temperature: true,
    humidity: true,
    moisture: true,
  });

  // Transform data for the chart
  const chartData = data.map((item) => {
    // Parse the timestamp to a date object
    let date;
    try {
      // Handle both ISO format and database format (YYYY-MM-DD HH:MM:SS)
      date = item.timestamp.includes('T') 
        ? parseISO(item.timestamp)
        : new Date(item.timestamp.replace(' ', 'T'));
    } catch (e) {
      console.error("Error parsing date:", e, "Original timestamp:", item.timestamp);
      date = new Date();
    }
    
    // Format date for display
    const formattedDate = format(date, "MMM dd HH:mm");
    
    return {
      timestamp: formattedDate,
      originalTimestamp: item.timestamp,
      temperature: item.temp,
      humidity: item.humi,
      moisture: item.moist || 0, // Use 0 if moisture is undefined
    };
  });

  // Handle legend click to toggle series visibility
  const handleLegendClick = (dataKey: keyof typeof activeLines) => {
    setActiveLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`tooltip-${index}`} 
              className="text-sm" 
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value} ${entry.name === 'Temperature' ? '°C' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No historical data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-lg shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            label={{ 
              value: 'Time', 
              position: 'insideBottomRight', 
              offset: -10 
            }}
            height={60}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            yAxisId="left"
            label={{ 
              value: 'Temperature (°C)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ 
              value: 'Humidity / Moisture (%)', 
              angle: -90, 
              position: 'insideRight',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            onClick={(e) => {
              // Fix: Safely convert dataKey to string and then check if it matches our state properties
              const dataKeyStr = String(e.dataKey).toLowerCase();
              if (dataKeyStr === "temperature" || dataKeyStr === "humidity" || dataKeyStr === "moisture") {
                handleLegendClick(dataKeyStr as keyof typeof activeLines);
              }
            }}
          />
          {activeLines.temperature && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              activeDot={{ r: 8 }}
              name="Temperature"
              connectNulls
            />
          )}
          {activeLines.humidity && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke="#4d908e"
              name="Humidity"
              connectNulls
            />
          )}
          {activeLines.moisture && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="moisture"
              stroke="#dda15e"
              name="Moisture"
              connectNulls
            />
          )}
          <Brush 
            dataKey="timestamp" 
            height={30} 
            stroke="#3a7e4f"
            startIndex={Math.max(0, chartData.length - 20)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;
