package repositories

import (
	"crops-recommendation/backend/models"
	"database/sql"
	"fmt"
	"net/http"
	"io"
	"os"
	"encoding/json"
	"bytes"

)

type SensorRepository struct {
	DB *sql.DB
}

func NewSensorRepository(db *sql.DB) *SensorRepository {
	return &SensorRepository{DB:db}
}

func (r *SensorRepository) GetSensorData() ([]models.SensorData, error) {
	var result []models.SensorData
	query := "SELECT id, timestamp, humi, temp, moist FROM project"
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	} 
	for rows.Next(){
		var data models.SensorData
		if err := rows.Scan(&data.ID, &data.Timestamp, &data.Humi, &data.Temp, &data.Moist); err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		result = append(result, data)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %v", err)
	}
	return result, nil
}

func(r *SensorRepository) GetStatSensorData() (models.StatSensorData, error) {
	var result models.StatSensorData

	query := "SELECT AVG(sensor_temperature) as Avg_Temp, " +
	"MAX(sensor_temperature) as MAX_Temp, MIN(sensor_temperature) as MIN_Temp, " +
	"MAX(sensor_humidity) as MAX_Humi, MIN(sensor_humidity) as MIN_Humi, " +
	"MAX(sensor_moist) as MAX_Moist, MIN(sensor_moist) as MIN_Moist, " +
	"AVG(sensor_humidity) as Avg_Humi, AVG(sensor_moist) as Avg_Moist " +
	"FROM merged_data"

	rows, err := r.DB.Query(query)
	if err != nil {
		return models.StatSensorData{}, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&result.AvgTemp, &result.MaxTemp, &result.MinTemp, &result.MaxHumi, &result.MinHumi, &result.MaxMoist, 
			&result.MinMoist, &result.AvgHumi, &result.AvgMoist)
		if err != nil {
			return models.StatSensorData{}, fmt.Errorf("error scanning row: %v", err)
		}
	} else {
		return models.StatSensorData{}, fmt.Errorf("no data returned from query")
	}

	return result, nil
}

func (r *SensorRepository) GetStatWeatherData() (models.StatWeatherData, error){
	var result models.StatWeatherData

	query := "SELECT AVG(api_temperature) as Avg_Temp, MAX(api_temperature) as MAX_Temp, MIN(api_temperature) as MIN_Temp, " +
	"MAX(api_humidity) as MAX_Humi, MIN(api_humidity) as MIN_Humi, " +
	"AVG(api_humidity) as Avg_Humi, " +
	"AVG(wind_speed) as Avg_Wind_Speed " +
	"FROM merged_data"

	rows, err := r.DB.Query(query)

	if err != nil {
		return models.StatWeatherData{}, fmt.Errorf("error executing query: %v", err)
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&result.AvgTemp, &result.MaxTemp, &result.MinTemp, &result.MaxHumi, &result.MinHumi ,&result.AvgHumi, &result.AvgWindSpeed)
		if err != nil {
			return models.StatWeatherData{}, fmt.Errorf("error scanning row: %v", err)
		}
	} else {
		return models.StatWeatherData{}, fmt.Errorf("no data returned from query")
	}

	return result, nil
}



func (r *SensorRepository) GetWeatherData() (models.WeatherData, error) {
	var result models.WeatherData
	query := `SELECT id, timestamp, temp, humidity, temp_min, temp_max, wind_speed, 
                     weather, weather_description, lat, lon, place 
              FROM secondary 
              ORDER BY timestamp DESC 
              LIMIT 1`

	row := r.DB.QueryRow(query)

	err := row.Scan(&result.ID, &result.Timestamp, &result.Temp, &result.Humi, &result.Temp_Min, 
		&result.Temp_Max, &result.Wind_Speed, &result.Weather, &result.Weather_Description, 
		&result.Lat, &result.Long, &result.Place)

	if err != nil {
		if err == sql.ErrNoRows {
			return models.WeatherData{}, fmt.Errorf("no weather data found")
		}
		return models.WeatherData{}, fmt.Errorf("query error: %v", err)
	}

	return result, nil
}

func(r *SensorRepository) GetlatestSensorData()(models.SensorData, error){
	var result models.SensorData
	query := "SELECT id, timestamp, humi, temp, moist FROM project ORDER BY timestamp DESC LIMIT 1"
	row := r.DB.QueryRow(query)

	err := row.Scan(&result.ID, &result.Timestamp, &result.Humi, &result.Temp, &result.Moist)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.SensorData{}, fmt.Errorf("no sensor data found")
		}
	}
	return result, nil
}

func(r *SensorRepository) GetMaxTempSensorData() (models.SensorData, error){
	var result models.SensorData
	query := `SELECT max(temp) as Max_Temp 
			FROM project
			GROUP BY timestamp`
	row := r.DB.QueryRow(query)

	err := row.Scan(&result.Temp)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.SensorData{}, fmt.Errorf("no sensor data found")
		}
	}
	return result, nil
}

func Get_weather_with_user_lon_lat(lat,lon string) (*models.WeatherResponse, error){
	apiKey := os.Getenv("WEATHER_API")
	apiURL := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s&units=metric", lat, lon, apiKey)
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch weather data: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading body: %w", err)
	}
	
	var weatherResponse models.WeatherResponse
	err = json.Unmarshal(body, &weatherResponse)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling response: %w", err)
	}
	return &weatherResponse, nil
}

func Predict_moist(temp, humi float64) (*models.PredictMoistResponse, error){
	moist_url := "http://localhost:8000/predict-moisture"
	req := &models.PredictMoistRequest{
		Temparature: temp,
		Humidity: humi,
	}

	jsonReq, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("error marshalling request: %w", err)
	}
	fmt.Println("Sending request:", string(jsonReq)) 

	resp, err := http.Post(moist_url, "application/json", bytes.NewBuffer(jsonReq))
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading body: %w", err)
	}
	fmt.Println("Response Body:", string(body)) 

	var result models.PredictMoistResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling response: %w", err)
	}
	return &result, nil
}


func Predict_crop(temp, humi, moisture float64)( *models.PredictCropResponse, error){
	crop_url := "http://localhost:8000/predict-crop"
	req := &models.PredictCropRequest{
		Temparature: temp,
		Humidity: humi,
		Moisture: moisture,
	}
	jsonReq, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("error marshalling request: %w", err)
	}
	resp, err := http.Post(crop_url, "application/json", bytes.NewBuffer(jsonReq))
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading body: %w", err)
	}

	var result models.PredictCropResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling response: %w", err)
	}
	return &result, nil
}