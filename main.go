package main

import (
    "fmt"
    "log"
    "crops-recommendation/backend/database"
)

func main() {
	db, err := database.ConnectDB() // Call ConnectDB() from database package
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}
	defer db.Close()

    rows, err := db.Query("SELECT humi, temp FROM project LIMIT 5")
	if err != nil {
		log.Fatal("Query failed:", err)
	}
	defer rows.Close()


	fmt.Println("Humi and Temp Data:")

	
	for rows.Next() {
		var humi float64
		var temp float64
		if err := rows.Scan(&humi, &temp); err != nil {
			log.Fatal("Scan failed:", err)
		}
		// Display the humi and temp values for each row
		fmt.Printf("Humi: %.2f, Temp: %.2f\n", humi, temp)
	}

	// Optionally check for any query errors
	if err := rows.Err(); err != nil {
		log.Fatal("Rows error:", err)
	}

	fmt.Println("Database connection is open and queries are working.")
}