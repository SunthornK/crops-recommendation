import { useQuery } from "@tanstack/react-query";
import { 
  SensorDataResponse, 
  HistoricalDataResponse, 
  WeatherDataResponse,
  DateRange,
  UserLocationWeatherResponse
} from "../types/types";
import { toast } from "@/hooks/use-toast";

// This URL would typically come from environment variables in a production app
const API_BASE_URL = "http://localhost:8080";

// Define environment detection
const isDevelopmentEnvironment = (): boolean => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Mock data for when API calls fail or when in production environment
const MOCK_SENSOR_DATA: SensorDataResponse = {
  data: {
    id: 1,
    humi: 65,
    temp: 25,
    moist: 45,
    timestamp: new Date().toISOString()
  }
};

const MOCK_WEATHER_DATA: WeatherDataResponse = {
  data: {
    id: 1,
    timestamp: new Date().toISOString(),
    temp: 24,
    humi: 60,
    temp_min: 22,
    temp_max: 26,
    wind_speed: 5,
    weather: "Clear",
    weather_description: "Clear sky",
    lat: 13.83,
    long: 100.57,
    place: "Demo Location"
  }
};

const MOCK_HISTORICAL_DATA: HistoricalDataResponse = {
  data: Array(12).fill(null).map((_, i) => ({
    id: i + 1,
    humi: 60 + Math.floor(Math.random() * 20),
    temp: 22 + Math.floor(Math.random() * 10),
    moist: 40 + Math.floor(Math.random() * 30),
    timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
  }))
};

// Function to fetch the latest sensor data
const fetchLatestSensorData = async (): Promise<SensorDataResponse> => {
  // Use mock data in production environments
  if (!isDevelopmentEnvironment()) {
    console.log("Using mock sensor data in production environment");
    return MOCK_SENSOR_DATA;
  }

  try {
    console.log(`Attempting to fetch sensor data from ${API_BASE_URL}/data/latest/sensor`);
    
    const response = await fetch(`${API_BASE_URL}/data/latest/sensor`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received sensor data:", data);
    return data;
  } catch (error) {
    console.error("Sensor data fetch failed:", error);
    
    // Only show toast in development environment
    if (isDevelopmentEnvironment()) {
      toast({
        title: "Using mock sensor data",
        description: "Could not connect to backend server. Using demo data for development.",
        variant: "default"
      });
    }
    
    console.log("Using mock sensor data");
    return MOCK_SENSOR_DATA;
  }
};

// Function to fetch the latest weather data
const fetchLatestWeatherData = async (): Promise<WeatherDataResponse> => {
  // Use mock data in production environments
  if (!isDevelopmentEnvironment()) {
    console.log("Using mock weather data in production environment");
    return MOCK_WEATHER_DATA;
  }

  try {
    console.log(`Attempting to fetch weather data from ${API_BASE_URL}/data/latest/weather`);
    
    const response = await fetch(`${API_BASE_URL}/data/latest/weather`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received weather data:", data);
    return data;
  } catch (error) {
    console.error("Weather data fetch failed:", error);
    
    // Only show toast in development environment
    if (isDevelopmentEnvironment()) {
      toast({
        title: "Using mock weather data",
        description: "Could not connect to backend server. Using demo data for development.",
        variant: "default"
      });
    }
    
    console.log("Using mock weather data");
    return MOCK_WEATHER_DATA;
  }
};

// Function to fetch historical data
const fetchHistoricalData = async (): Promise<HistoricalDataResponse> => {
  // Use mock data in production environments
  if (!isDevelopmentEnvironment()) {
    console.log("Using mock historical data in production environment");
    return MOCK_HISTORICAL_DATA;
  }

  try {
    console.log(`Attempting to fetch historical data from ${API_BASE_URL}/data`);
    
    const response = await fetch(`${API_BASE_URL}/data`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received historical data:", data);
    return data;
  } catch (error) {
    console.error("Historical data fetch failed:", error);
    
    // Only show toast in development environment
    if (isDevelopmentEnvironment()) {
      toast({
        title: "Using mock historical data",
        description: "Could not connect to backend server. Using demo data for development.",
        variant: "default"
      });
    }
    
    console.log("Using mock historical data");
    return MOCK_HISTORICAL_DATA;
  }
};

// Function to fetch user location weather data
const fetchUserLocationWeather = async (lat: string, lon: string): Promise<UserLocationWeatherResponse> => {
  // Use mock data in production environments
  if (!isDevelopmentEnvironment()) {
    console.log("Using mock weather data in production environment");
    return {
      coord: { lon: parseFloat(lon), lat: parseFloat(lat) },
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      main: { temp: 25, feels_like: 25, temp_min: 23, temp_max: 27, pressure: 1015, humidity: 60 }
    };
  }

  try {
    console.log(`Attempting to fetch user location weather data from ${API_BASE_URL}/data/weather?lat=${lat}&lon=${lon}`);
    
    const response = await fetch(`${API_BASE_URL}/data/weather?lat=${lat}&lon=${lon}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received user location weather data:", data);
    
    // Ensure weather property is an array, even if empty
    if (data && data.weather === null) {
      data.weather = [];
    }
    
    return data;
  } catch (error) {
    console.error("User location weather data fetch failed:", error);
    
    // Only show toast in development environment
    if (isDevelopmentEnvironment()) {
      toast({
        title: "Using mock location weather data",
        description: "Could not connect to backend server. Using demo data for development.",
        variant: "default"
      });
    }
    
    console.log("Using mock location weather data");
    return {
      coord: { lon: parseFloat(lon), lat: parseFloat(lat) },
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      main: { temp: 25, feels_like: 25, temp_min: 23, temp_max: 27, pressure: 1015, humidity: 60 }
    };
  }
};

// Hook for fetching latest sensor data
export const useLatestSensorData = () => {
  return useQuery({
    queryKey: ["latestSensorData"],
    queryFn: fetchLatestSensorData,
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch sensor data:", error);
      }
    }
  });
};

// Hook for fetching latest weather data
export const useLatestWeatherData = () => {
  return useQuery({
    queryKey: ["latestWeatherData"],
    queryFn: fetchLatestWeatherData,
    refetchInterval: 300000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch weather data:", error);
      }
    }
  });
};

// Hook for fetching historical data
export const useHistoricalData = () => {
  return useQuery({
    queryKey: ["historicalData"],
    queryFn: fetchHistoricalData,
    refetchInterval: 3600000, // Refetch every hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch historical data:", error);
      }
    }
  });
};

// Hook for fetching user location weather data
export const useUserLocationWeather = (lat: string, lon: string) => {
  return useQuery({
    queryKey: ["userLocationWeather", lat, lon],
    queryFn: () => fetchUserLocationWeather(lat, lon),
    enabled: !!lat && !!lon, // Only run query when lat and lon are provided
    refetchInterval: 300000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch user location weather data:", error);
      }
    }
  });
};

// Filter historical data by date range
export const filterDataByDateRange = (
  data: HistoricalDataResponse | undefined,
  dateRange: DateRange
) => {
  if (!data || !data.data) {
    return [];
  }

  const { startDate, endDate } = dateRange;
  
  return data.data.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

// Calculate average values from historical data
export const calculateAverages = (
  data: HistoricalDataResponse | undefined
) => {
  if (!data || !data.data || data.data.length === 0) {
    return {
      avgTemperature: 0,
      avgHumidity: 0,
      avgMoisture: 0,
    };
  }

  const sum = data.data.reduce(
    (acc, item) => {
      return {
        temp: acc.temp + item.temp,
        humi: acc.humi + item.humi,
        moist: acc.moist + (item.moist || 0), // Handle potential undefined values
      };
    },
    { temp: 0, humi: 0, moist: 0 }
  );

  const count = data.data.length;

  return {
    avgTemperature: +(sum.temp / count).toFixed(1),
    avgHumidity: +(sum.humi / count).toFixed(1),
    avgMoisture: +(sum.moist / count).toFixed(1),
  };
};
