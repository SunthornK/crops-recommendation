
import PredictionForm from "@/components/Predictions/PredictionForm";
import { Wand2 } from "lucide-react";

const Predictions = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 sm:mb-0">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            Environmental Predictions
          </h1>
          <p className="text-muted-foreground">
            Get predictions for soil moisture and suitable crops based on environmental conditions
          </p>
        </div>

        <PredictionForm />
      </div>
    </div>
  );
};

export default Predictions;
