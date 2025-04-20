package handler

import (
	"crops-recommendation/backend/models"
	"crops-recommendation/backend/repositories"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SensorHandler struct {
	Repo *repositories.SensorRepository
}

func NewSensorHandler(repo *repositories.SensorRepository) *SensorHandler {
	return &SensorHandler{Repo: repo}
}

// GetAllPrimaryData 	godoc
// @Summary 			Get all primary data
// @Description 		Fetch all primary data from database
// @Produce 			application/json
// @Success 			200 {array} models.SensorData
// @Router 			/data [get]
func (h *SensorHandler) GetAllPrimaryData(c *gin.Context){
	data, err := h.Repo.GetSensorData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return 
	}
	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})	
}

// GetStatSensorData 	godoc
// @Summary 			Get statistic from sensor data
// @Description 		Fetch statistic from sensor data from database
// @Produce 			application/json
// @Success 			200 {object} models.StatSensorData
// @Router 			/data/stat/sensor [get]
func (h *SensorHandler) GetStatSensorData(c *gin.Context){
	data, err := h.Repo.GetStatSensorData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

// GetStatWeatherData 	godoc
// @Summary 			Get statistic from weather data
// @Description 		Fetch statistic from weatherAPI data from database
// @Produce 			application/json
// @Success 			200 {object} models.StatWeatherData
// @Router 			/data/stat/weather [get]
func (h *SensorHandler) GetStatWeatherData(c *gin.Context){
	data, err := h.Repo.GetStatWeatherData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

// GetlatestWeatherData 	godoc
// @Summary 			Fetch weather information from database
// @Description 		Fetch weather information from database
// @Produce 			application/json
// @Success 			200 {object} models.WeatherData
// @Router 			/data/latest/weather [get]
func(h *SensorHandler) GetWeatherData(c *gin.Context){
	data, err := h.Repo.GetWeatherData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return 
	}
	c.JSON(http.StatusOK, gin.H{"data": data,
	})

}

// GetlatestSensorData 	godoc
// @Summary 			Fetch weather data from sensor information from database
// @Description 		Fetch weather data from sensor information from database
// @Produce 			application/json
// @Success 			200 {object} models.SensorData
// @Router 			/data/latest/sensor [get]
func (h *SensorHandler) GetlatestSensorData(c *gin.Context){
	data, err := h.Repo.GetlatestSensorData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

// Get_weather_with_user_lon_lat godoc
// @Summary Get weather data from user's latitude and longitude
// @Description Retrieve weather data based on query parameters lat and lon
// @Produce application/json
// @Param lat query string true "Latitude"
// @Param lon query string true "Longitude"
// @Success 200 {object} models.WeatherResponse 
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /data/weather [get]
func (h *SensorHandler) Get_weather_with_user_lon_lat(c *gin.Context){
	lat := c.Query("lat")
	lon := c.Query("lon")
	if lat == "" || lon == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing lat or lon parameters"})
		return
	}
	weatherData, err := repositories.Get_weather_with_user_lon_lat(lat,lon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"coord": weatherData.Coord,
		"weather": weatherData.Weather,
		"main": weatherData.Main,
	})
}

// @Summary Predict moisture level
// @Description Predict moisture level based on temperature and humidity
// @Param body body models.PredictMoistRequest true "Request body"
// @Produce application/json
// @Success 200 {object} models.PredictMoistResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /data/predict-moisture [post]
func (h *SensorHandler) Predict_moist(c *gin.Context){
	var input models.PredictMoistRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := repositories.Predict_moist(input.Temparature, input.Humidity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return 
	}
	fmt.Println(result)
	c.JSON(http.StatusOK, result)
}

// @Summary Predict Crop type 
// @Description Predict Crop type based on temperature, humidity and moisture
// @Param body body models.PredictCropRequest true "Request body"
// @Produce application/json
// @Success 200 {object} models.PredictCropResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /data/predict-crop [post]
func (h *SensorHandler) Predict_crop(c *gin.Context){
	var input models.PredictCropRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := repositories.Predict_crop(input.Temparature, input.Humidity, input.Moisture)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return 
	}
	c.JSON(http.StatusOK, result)
}