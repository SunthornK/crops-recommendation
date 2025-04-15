
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Map, Navigation } from "lucide-react";

interface LocationSelectorProps {
  onLocationSelected: (lat: string, lon: string) => void;
}

const LocationSelector = ({ onLocationSelected }: LocationSelectorProps) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!latitude || !longitude) {
      toast({
        title: "Missing coordinates",
        description: "Please enter both latitude and longitude",
        variant: "destructive"
      });
      return;
    }

    // Check if values are valid numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      toast({
        title: "Invalid coordinates",
        description: "Latitude and longitude must be valid numbers",
        variant: "destructive"
      });
      return;
    }

    // Check if values are within valid range
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast({
        title: "Invalid coordinates",
        description: "Latitude must be between -90 and 90, longitude between -180 and 180",
        variant: "destructive"
      });
      return;
    }

    onLocationSelected(latitude, longitude);
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude.toFixed(6));
        setLongitude(longitude.toFixed(6));
        setIsLoading(false);
        
        toast({
          title: "Location detected",
          description: "Your current location has been detected",
          variant: "default"
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location error",
          description: error.message || "Failed to get your location",
          variant: "destructive"
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Location Selector
        </CardTitle>
        <CardDescription>
          Enter coordinates or use your current location to get weather data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                placeholder="e.g. 13.7563"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                placeholder="e.g. 100.5018"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? "Detecting..." : "Use My Location"}
        </Button>
        <Button onClick={handleSubmit} disabled={!latitude || !longitude}>
          <Navigation className="mr-2 h-4 w-4" />
          Get Weather
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocationSelector;
