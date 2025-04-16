
import { useQuery } from "@tanstack/react-query";
import { SensorStatsResponse, WeatherStatsResponse } from "@/types/types";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8080";

const isDevelopmentEnvironment = (): boolean => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Mock data for when API calls fail or when in production environment
const MOCK_SENSOR_STATS: SensorStatsResponse = {
  data: {
    avg_humi: 79.89,
    avg_temp: 29.92,
    avg_moist: 31.66,
    max_temp: 31,
    min_temp: 26,
    max_humi: 93,
    min_humi: 55,
    max_moist: 93.43,
    min_moist: 0
  }
};

const MOCK_WEATHER_STATS: WeatherStatsResponse = {
  data: {
    w_avg_temp: 31.51,
    w_max_temp: 36.6,
    w_min_temp: 26.55,
    w_avg_humi: 70.82,
    w_max_humi: 99,
    w_min_humi: 28,
    w_avg_wind_speed: 3.33
  }
};

const fetchSensorStats = async (): Promise<SensorStatsResponse> => {
  if (!isDevelopmentEnvironment()) {
    return MOCK_SENSOR_STATS;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/data/stat/sensor`);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Sensor stats fetch failed:", error);
    if (isDevelopmentEnvironment()) {
      toast({
        title: "Using mock sensor stats",
        description: "Could not connect to backend server. Using demo data for development.",
        variant: "default"
      });
    }
    return MOCK_SENSOR_STATS;
  }
};

const fetchWeatherStats = async (): Promise<WeatherStatsResponse> => {
  if (!isDevelopmentEnvironment()) {
    return MOCK_WEATHER_STATS;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/data/stat/weather`);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Weather stats fetch failed:", error);
    if (isDevelopmentEnvironment()) {
      toast({
        title: "Using mock weather stats",
        description: "Could not connect to backend server. Using demo data for development.",
        variant: "default"
      });
    }
    return MOCK_WEATHER_STATS;
  }
};

export const useSensorStats = () => {
  return useQuery({
    queryKey: ["sensorStats"],
    queryFn: fetchSensorStats,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useWeatherStats = () => {
  return useQuery({
    queryKey: ["weatherStats"],
    queryFn: fetchWeatherStats,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
