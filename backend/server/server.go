package server

import (
	"github.com/gin-gonic/gin"
)

func server() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello World!",
		})
	})
	r.Run("localhost:8000")
}

