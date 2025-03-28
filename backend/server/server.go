package server

import (
	"crops-recommendation/backend/database"
	"crops-recommendation/backend/route"
	"github.com/gin-gonic/gin"
	"log"
)

func Startserver(){
	db, err := database.ConnectDB()
	if err != nil{
		log.Fatal("Failed to connect to database:", err)
	}
	
	defer db.Close()
	router := gin.Default()
	route.SetupRouter(router, db)
	router.Run("localhost:8080")

}

