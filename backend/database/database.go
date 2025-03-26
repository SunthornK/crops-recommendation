package database

import (
	"os"
	"database/sql"
	"fmt"
	"log"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"

)

func ConnectDB() (*sql.DB, error){
	env := godotenv.Load(".env")
	if env != nil{
		log.Fatal("Error loading .env file")
	}
	dbUser := os.Getenv("dbUser")
	dbPassword := os.Getenv("dbPassword")
	dbServer := os.Getenv("dbServer")
	dbName := os.Getenv("dbName")
	dbPort := os.Getenv("dbPort")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbServer, dbPort, dbName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error to connect database", err)
	}
	err = db.Ping()
	if err != nil{
		log.Fatal("Error to connect database", err)
	}
	fmt.Println("Connected to MySQL!")
	return db, nil
}
