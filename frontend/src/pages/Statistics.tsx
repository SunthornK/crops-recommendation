import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensorStats, useWeatherStats } from "@/hooks/useStats";
import { Thermometer, Droplet, Wind, Gauge } from "lucide-react";

const Statistics = () => {
  const { data: sensorStats, isLoading: sensorLoading } = useSensorStats();
  const { data: weatherStats, isLoading: weatherLoading } = useWeatherStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Environmental Statistics</h1>
          <p className="text-muted-foreground">
            Comprehensive statistics from sensor and weather data
          </p>
        </div>

        {/* Sensor Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Statistics</CardTitle>
            <CardDescription>Environmental data from local sensors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Temperature Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <h3 className="font-semibold">Temperature</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium text-foreground">{sensorStats?.data.avg_temp.toFixed(1)}°C</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Max: <span className="font-medium text-foreground">{sensorStats?.data.max_temp}°C</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: <span className="font-medium text-foreground">{sensorStats?.data.min_temp}°C</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Humidity Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <h3 className="font-semibold">Humidity</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium text-foreground">{sensorStats?.data.avg_humi.toFixed(1)}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Max: <span className="font-medium text-foreground">{sensorStats?.data.max_humi}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: <span className="font-medium text-foreground">{sensorStats?.data.min_humi}%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Moisture Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-amber-500" />
                    <h3 className="font-semibold">Soil Moisture</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium text-foreground">{sensorStats?.data.avg_moist.toFixed(1)}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Max: <span className="font-medium text-foreground">{sensorStats?.data.max_moist.toFixed(2)}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: <span className="font-medium text-foreground">{sensorStats?.data.min_moist.toFixed(2)}%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Weather Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Api Statistics</CardTitle>
            <CardDescription>Data from weather api</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Weather Temperature Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <h3 className="font-semibold">Temperature</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium text-foreground">{weatherStats?.data.w_avg_temp.toFixed(1)}°C</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Max: <span className="font-medium text-foreground">{weatherStats?.data.w_max_temp.toFixed(1)}°C</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: <span className="font-medium text-foreground">{weatherStats?.data.w_min_temp.toFixed(1)}°C</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Humidity Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <h3 className="font-semibold">Humidity</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium text-foreground">{weatherStats?.data.w_avg_humi.toFixed(1)}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Max: <span className="font-medium text-foreground">{weatherStats?.data.w_max_humi}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: <span className="font-medium text-foreground">{weatherStats?.data.w_min_humi}%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Wind Speed Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-sky-500" />
                    <h3 className="font-semibold">Wind Speed</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Average: <span className="font-medium text-foreground">{weatherStats?.data.w_avg_wind_speed.toFixed(1)} m/s</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Add Statistics Charts */}
        {/* {!sensorLoading && !weatherLoading && sensorStats && weatherStats && (
          <StatisticsCharts 
            sensorStats={sensorStats.data} 
            weatherStats={weatherStats.data} 
          />
        )} */}
      </div>
    </div>
  );
};

export default Statistics;
