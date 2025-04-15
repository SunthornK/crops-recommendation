
export interface PredictMoistRequest {
  temparature: number;
  humidity: number;
}

export interface PredictCropRequest {
  temparature: number;
  humidity: number;
  moisture: number;
}

export interface PredictionResponse {
  predict_crop?: string;
  predict_moist?: number;
}
