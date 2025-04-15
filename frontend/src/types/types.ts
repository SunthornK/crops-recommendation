// Sensor data types
export interface SensorData {
  id: number;
  humi: number;
  temp: number;
  moist: number;
  timestamp: string;
}

export interface SensorDataResponse {
  data: SensorData;
}

export interface HistoricalDataResponse {
  data: SensorData[];
}

// Weather data types
export interface WeatherData {
  id: number;
  timestamp: string;
  temp: number;
  humi: number;
  temp_min: number;
  temp_max: number;
  wind_speed: number;
  weather: string;
  weather_description: string;
  lat: number;
  long: number;
  place: string;
}

export interface WeatherDataResponse {
  data: WeatherData;
}

// User location weather data
export interface UserLocationWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
}

// Date range for filtering historical data
export interface DateRange {
  startDate: Date;
  endDate: Date;
}
