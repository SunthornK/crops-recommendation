package route

import (
	"database/sql"
	"crops-recommendation/backend/handler"
	"crops-recommendation/backend/repositories"
	"github.com/gin-gonic/gin"
	ginSwagger "github.com/swaggo/gin-swagger"
	swaggerFiles "github.com/swaggo/files"
)

func SetupRouter(router *gin.Engine, db *sql.DB) {
	repo := repositories.NewSensorRepository(db)
	handler := handler.NewSensorHandler(repo)
	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.GET("/data", handler.GetAllPrimaryData)
	router.GET("/data/stat/sensor", handler.GetStatSensorData)
	router.GET("/data/stat/weather", handler.GetStatWeatherData)
	router.GET("/data/latest/weather", handler.GetWeatherData)
	router.GET("/data/latest/sensor",handler.GetlatestSensorData)
	router.GET("/data/weather", handler.Get_weather_with_user_lon_lat)
	router.POST("/data/predict-moisture", handler.Predict_moist)
	router.POST("/data/predict-crop", handler.Predict_crop)
}
