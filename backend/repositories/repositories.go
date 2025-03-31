package repositories

import (
    "fmt"
	"database/sql"
	"crops-recommendation/backend/models"
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