package route

import (
	"database/sql"
	"crops-recommendation/backend/handler"
	"crops-recommendation/backend/repositories"
	"github.com/gin-gonic/gin"
)

func SetupRouter(router *gin.Engine, db *sql.DB) {
	repo := repositories.NewSensorRepository(db)
	handler := handler.NewSensorHandler(repo)
	router.GET("/data", handler.GetAllPrimaryData)
	router.GET("/data/latest/weather", handler.GetWeatherData)
	router.GET("/data/latest/sensor",handler.GetlatestSensorData)
	router.GET("/data/maxtemp/sensor",handler.GetMaxTempSensorData)
	router.GET("/data/weather", handler.Get_weather_with_user_lon_lat)
	router.POST("/data/predict-moisture", handler.Predict_moist)
	router.POST("/data/predict-crop", handler.Predict_crop)
}
