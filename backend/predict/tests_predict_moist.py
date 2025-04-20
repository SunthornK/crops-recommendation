import unittest
from fastapi.testclient import TestClient
from main import app
from models.model import PredictMoistRequest, PredictMoistResponse

client = TestClient(app)

class TestPredictMoisture(unittest.TestCase):
    def test_valid_data(self):
        data = PredictMoistRequest(Temparature=25, Humidity=60)
        response = client.post("/predict-moisture", json=data.model_dump())
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertIn("predict_moist", response.json())

    def test_no_data(self):
        response = client.post("/predict-moisture", json=None)
        self.assertEqual(response.status_code, 422)

    def test_invalid_data_type(self):
        data = "invalid data"
        response = client.post("/predict-moisture", json=data)
        self.assertEqual(response.status_code, 422)  # Unprocessable Entity

    def test_missing_required_fields(self):
        data = {"Temparature": 25}  
        response = client.post("/predict-moisture", json=data)
        self.assertEqual(response.status_code, 422)  # Unprocessable Entity

if __name__ == "__main__":
    unittest.main()