from fastapi import FastAPI
from fastapi.responses import JSONResponse
import joblib
import pandas as pd
from models.model import PredictMoistRequest, PredictMoistResponse, PredictCropRequest, PredictCropResponse


app = FastAPI()

moisture_model = joblib.load("ai_model/moisture_model.pkl")
crop_model = joblib.load("ai_model/crop_model.pkl")

@app.post("/predict-moisture", response_model=PredictMoistResponse,)
def predict_moist(data: PredictMoistRequest):
    if data == None:
        return JSONResponse(content={"message": "No data provided"}, status_code=400)
    df = pd.DataFrame([data.dict()])
    prediction = moisture_model.predict(df)
    response = PredictMoistResponse(predict_moist=prediction[0])
    return JSONResponse(content=response.dict(), status_code=200)

@app.post("/predict-crop", response_model=PredictCropResponse,)
def predict_crop(data: PredictCropRequest):
    if data == None:
        return JSONResponse(content ={"message": "No data provided"}, status_code=400)
    df = pd.DataFrame([data.dict()])
    prediction = crop_model.predict(df)
    response = PredictCropResponse(predict_crop=prediction[0])
    return JSONResponse(content=response.dict(), status_code=200)


    