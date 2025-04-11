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

func (h *SensorHandler) GetMaxTempSensorData(c *gin.Context){
	data, err := h.Repo.GetMaxTempSensorData()
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