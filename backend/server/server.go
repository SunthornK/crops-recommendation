package server

import (
	"crops-recommendation/backend/database"
	"crops-recommendation/backend/route"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"log"
	"time"
)

func Startserver(){
	db, err := database.ConnectDB()
	if err != nil{
		log.Fatal("Failed to connect to database:", err)
	}

	defer db.Close()
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // Cache preflight request
	}))

	route.SetupRouter(router, db)

	router.Run("localhost:8080")
}