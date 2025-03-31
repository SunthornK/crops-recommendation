package models

type SensorData struct {
	ID int `json:"id"`
	Humi float64 `json:"humi"`
	Temp float64 `json:"temp"`
	Moist float64 `json:"moist"`
	Timestamp string `json:"timestamp"`
}

type WeatherData struct {
	ID int `json:"id"`
	Timestamp string `json:"timestamp"`
	Temp float64 `json:"temp"`
	Humi float64 `json:"humi"`
	Temp_Min float64 `json:"temp_min"`
	Temp_Max float64 `json:"temp_max"`
	Wind_Speed float64 `json:"wind_speed"`
	Weather string `json:"weather"`
	Weather_Description string `json:"weather_description"`
	Lat float64 `json:"lat"`
	Long float64 `json:"long"`
	Place string `json:"place"`
}