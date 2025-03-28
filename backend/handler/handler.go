package handler

import (
	"crops-recommendation/backend/repositories"
	"github.com/gin-gonic/gin"
	"net/http"
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