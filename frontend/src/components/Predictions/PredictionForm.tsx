
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMoisturePrediction, useCropPrediction } from "@/hooks/usePredictions";
import { Droplets, Leaf } from "lucide-react";

export const PredictionForm = () => {
  const [temparature, setTemparature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [moisture, setMoisture] = useState("");
  
  const moistureMutation = useMoisturePrediction();
  const cropMutation = useCropPrediction();

  const handleMoisturePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temparature || !humidity) return;
    
    moistureMutation.mutate({
      temparature: Number(temparature),
      humidity: Number(humidity),
    });
  };

  const handleCropPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temparature || !humidity || !moisture) return;
    
    cropMutation.mutate({
      temparature: Number(temparature),
      humidity: Number(humidity),
      moisture: Number(moisture),
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Moisture Prediction
          </CardTitle>
          <CardDescription>
            Predict soil moisture based on temparature and humidity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMoisturePrediction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="temparature">Temparature (°C)</Label>
              <Input
                id="temparature"
                type="number"
                value={temparature}
                onChange={(e) => setTemparature(e.target.value)}
                placeholder="Enter temparature"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="Enter humidity"
                required
              />
            </div>
            <Button type="submit" disabled={moistureMutation.isPending}>
              Predict Moisture
            </Button>
            {moistureMutation.data && moistureMutation.data.predict_moist !== undefined && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Predicted Moisture:</p>
                <p className="text-2xl">{moistureMutation.data.predict_moist.toFixed(2)}%</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Crop Prediction
          </CardTitle>
          <CardDescription>
            Predict suitable crop based on environmental conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCropPrediction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="crop-temparature">Temparature (°C)</Label>
              <Input
                id="crop-temparature"
                type="number"
                value={temparature}
                onChange={(e) => setTemparature(e.target.value)}
                placeholder="Enter temparature"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crop-humidity">Humidity (%)</Label>
              <Input
                id="crop-humidity"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="Enter humidity"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="moisture">Moisture (%)</Label>
              <Input
                id="moisture"
                type="number"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                placeholder="Enter moisture"
                required
              />
            </div>
            <Button type="submit" disabled={cropMutation.isPending}>
              Predict Crop
            </Button>
            {cropMutation.data && cropMutation.data.predict_crop && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Recommended Crop:</p>
                <p className="text-2xl capitalize">{cropMutation.data.predict_crop}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionForm;
