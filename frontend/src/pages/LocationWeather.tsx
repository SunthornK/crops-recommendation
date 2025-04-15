
import { useState } from "react";
import LocationSelector from "@/components/LocationSelector/LocationSelector";
import WeatherDisplay from "@/components/LocationSelector/LocationWeather";
import { Compass } from "lucide-react";

const LocationWeatherPage = () => {
  const [coordinates, setCoordinates] = useState<{ lat: string; lon: string } | null>(null);

  const handleLocationSelected = (lat: string, lon: string) => {
    setCoordinates({ lat, lon });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 sm:mb-0">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Compass className="h-6 w-6" />
            Location Weather
          </h1>
          <p className="text-muted-foreground">
            Check the weather at any location by entering coordinates
          </p>
        </div>

        <section className="space-y-4">
          <LocationSelector onLocationSelected={handleLocationSelected} />
        </section>

        {coordinates && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Weather Results</h2>
            <WeatherDisplay latitude={coordinates.lat} longitude={coordinates.lon} />
          </section>
        )}
      </div>
    </div>
  );
};

export default LocationWeatherPage;
