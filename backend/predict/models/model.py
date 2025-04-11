from pydantic import BaseModel

class PredictMoistRequest(BaseModel):
    Temparature: float
    Humidity: float
    
    
class PredictMoistResponse(BaseModel):
    predict_moist: float
    

class PredictCropRequest(BaseModel):
    Temparature: float
    Humidity: float
    Moisture: float     
    
    
class PredictCropResponse(BaseModel):
    predict_crop: str
    
