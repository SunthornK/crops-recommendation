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