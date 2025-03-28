package models

type SensorData struct {
	ID int `json:"id"`
	Humi float64 `json:"humi"`
	Temp float64 `json:"temp"`
	Moist float64 `json:"moist"`
	Timestamp string `json:"timestamp"`
}