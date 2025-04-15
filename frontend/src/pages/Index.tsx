
import SensorDataDisplay from "@/components/Dashboard/SensorDataDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHistoricalData, useLatestSensorData, calculateAverages } from "@/hooks/useEnvironmentalData";
import HistoricalChart from "@/components/Charts/HistoricalChart";
import { CloudRain, Droplets, ThermometerSun } from "lucide-react";

const Index = () => {
  const { data: latestSensorData, isLoading: isLoadingLatest } = useLatestSensorData();
  const { data: historicalData, isLoading: isLoadingHistorical } = useHistoricalData();

  // Calculate averages from historical data
  const averages = calculateAverages(historicalData);

  // Get a subset of historical data for the mini chart
  const recentHistoricalData = historicalData?.data 
    ? [...historicalData.data].slice(-12) 
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 sm:mb-0">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Environmental Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor real-time environmental data and get insights for your farm
          </p>
        </div>

        {/* Current Sensor Data Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Current Conditions</h2>
          <SensorDataDisplay />
        </section>

        {/* Averages Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Average Conditions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <ThermometerSun className="w-4 h-4 mr-2" />
                  Average Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averages.avgTemperature}°C</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CloudRain className="w-4 h-4 mr-2" />
                  Average Humidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averages.avgHumidity}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Droplets className="w-4 h-4 mr-2" />
                  Average Soil Moisture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averages.avgMoisture}%</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Data Chart Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Data Trends</h2>
          <Card>
            <CardHeader>
              <CardTitle>Environmental Trends</CardTitle>
              <CardDescription>
                Recent sensor readings over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HistoricalChart 
                data={recentHistoricalData} 
                isLoading={isLoadingHistorical} 
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Index;
