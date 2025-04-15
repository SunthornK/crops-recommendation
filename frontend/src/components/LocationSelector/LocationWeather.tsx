
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserLocationWeather } from "@/hooks/useEnvironmentalData";
import { Cloud, CloudRain, Thermometer, Wind } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface LocationWeatherProps {
  latitude: string;
  longitude: string;
}

const LocationWeather = ({ latitude, longitude }: LocationWeatherProps) => {
  const { 
    data: weatherData,
    isLoading,
    isError,
    error
  } = useUserLocationWeather(latitude, longitude);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading weather data</AlertTitle>
        <AlertDescription>
          {error instanceof Error 
            ? `${error.message}` 
            : 'There was a problem fetching weather data for this location'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherData || !weatherData.weather) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No weather data available</AlertTitle>
        <AlertDescription>
          Weather data for this location is not available
        </AlertDescription>
      </Alert>
    );
  }

  // Get the weather description and icon - add null checks
  const weatherDescription = weatherData.weather && weatherData.weather[0] 
    ? weatherData.weather[0].description 
    : "Unknown weather";
  const weatherMain = weatherData.weather && weatherData.weather[0] 
    ? weatherData.weather[0].main 
    : "Unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather at {weatherData.coord.lat.toFixed(4)}, {weatherData.coord.lon.toFixed(4)}
        </CardTitle>
        <CardDescription className="capitalize">
          {weatherDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-muted-foreground">
            <Thermometer className="mr-1 h-4 w-4" />
            <span className="text-sm">Temperature</span>
          </div>
          <span className="text-2xl font-bold">{weatherData.main.temp}°C</span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-muted-foreground">
            <Thermometer className="mr-1 h-4 w-4" />
            <span className="text-sm">Feels Like</span>
          </div>
          <span className="text-2xl font-bold">{weatherData.main.feels_like}°C</span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-muted-foreground">
            <CloudRain className="mr-1 h-4 w-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <span className="text-2xl font-bold">{weatherData.main.humidity}%</span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-muted-foreground">
            <Wind className="mr-1 h-4 w-4" />
            <span className="text-sm">Pressure</span>
          </div>
          <span className="text-2xl font-bold">{weatherData.main.pressure} hPa</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationWeather;
