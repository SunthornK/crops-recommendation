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
}
