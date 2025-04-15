
import { useMutation } from "@tanstack/react-query";
import { 
  PredictMoistRequest, 
  PredictCropRequest, 
  PredictionResponse 
} from "@/types/prediction";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8080";

export const useMoisturePrediction = () => {
  return useMutation<PredictionResponse, Error, PredictMoistRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${API_BASE_URL}/data/predict-moisture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temparature: data.temparature,
          humidity: data.humidity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to predict moisture');
      }

      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Prediction Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCropPrediction = () => {
  return useMutation<PredictionResponse, Error, PredictCropRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${API_BASE_URL}/data/predict-crop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temparature: data.temparature,
          humidity: data.humidity,
          moisture: data.moisture,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to predict crop');
      }

      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Prediction Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
