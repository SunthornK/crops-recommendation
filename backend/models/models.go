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


type WeatherResponse struct {
	Coord struct {
		Lon float64 `json:"lon"`
		Lat float64 `json:"lat"`
	} `json:"coord"`
	Weather []struct {
		ID          int    `json:"id"`
		Main        string `json:"main"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
	} `json:"weather"`
	Base       string `json:"base"`
	Main       struct {
		Temp        float64 `json:"temp"`
		FeelsLike   float64 `json:"feels_like"`
		TempMin     float64 `json:"temp_min"`
		TempMax     float64 `json:"temp_max"`
		Pressure    int     `json:"pressure"`
		Humidity    int     `json:"humidity"`
		SeaLevel    int     `json:"sea_level"`
		GrndLevel   int     `json:"grnd_level"`
	} `json:"main"`
	Visibility int `json:"visibility"`
	Wind       struct {
		Speed float64 `json:"speed"`
		Deg   int     `json:"deg"`
		Gust  float64 `json:"gust"`
	} `json:"wind"`
	Clouds struct {
		All int `json:"all"`
	} `json:"clouds"`
	Dt     int  `json:"dt"`
	Sys    struct {
		Sunrise int `json:"sunrise"`
		Sunset  int `json:"sunset"`
	} `json:"sys"`
	TimeZone int  `json:"timezone"`
	ID       int  `json:"id"`
	Name     string `json:"name"`
	Cod      int `json:"cod"`
}
