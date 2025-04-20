package main_test

import (
    "crops-recommendation/backend/database"
    "crops-recommendation/backend/handler"
    "crops-recommendation/backend/models"
    "crops-recommendation/backend/repositories"
    "encoding/json"
    "fmt"
    "testing"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    "github.com/stretchr/testify/assert"
    "net/http"
    "net/http/httptest"
	"database/sql"
)

// Global Test Setup
var testSetup *TestSetup

func TestMain(m *testing.M) {
    // Perform setup once before any tests run
    testSetup = NewTestSetup()

    // Ensure to clean up after the tests are done
    defer testSetup.db.Close()

    // Run tests
    m.Run()
}

func UnmarshalResponse[T any](body []byte, dest *T) error {
    type wrappedResponse struct {
        Data T `json:"data"`
    }

    var wrapped wrappedResponse
    err := json.Unmarshal(body, &wrapped)
    if err == nil {
        *dest = wrapped.Data
        return nil
    }

    err = json.Unmarshal(body, dest)
    if err != nil {
        return fmt.Errorf("failed to unmarshal response: %w", err)
    }

    return nil
}

// Your test setup structure
type TestSetup struct {
    handler *handler.SensorHandler
    repo    *repositories.SensorRepository
    db      *sql.DB
    router  *gin.Engine
}

func NewTestSetup() *TestSetup {
    godotenv.Load(".env")
    db, _ := database.ConnectDB()
    repo := repositories.NewSensorRepository(db)
    handler := handler.NewSensorHandler(repo)
    router := gin.Default()
    return &TestSetup{handler: handler, repo: repo, db: db, router: router}
}


func TestGetAllPrimaryData(t *testing.T) {
    r := testSetup.router
    handler := testSetup.handler
    r.GET("/data", handler.GetAllPrimaryData)
    req, _ := http.NewRequest("GET", "/data", nil)
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)

    var data []models.SensorData
    err := UnmarshalResponse(w.Body.Bytes(), &data)
    if err != nil {
        t.Fatalf("Error unmarshaling response: %v", err)
    }

    assert.Equal(t, http.StatusOK, w.Code)
    assert.NotEmpty(t, data)
}


func TestGetStatSensorData(t *testing.T) {
    r := testSetup.router
    handler := testSetup.handler
    r.GET("/data/stat/sensor", handler.GetStatSensorData)
    req, _ := http.NewRequest("GET", "/data/stat/sensor", nil)
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)

    var data models.StatSensorData
    err := UnmarshalResponse(w.Body.Bytes(), &data)
    if err != nil {
        t.Fatalf("Error unmarshaling response: %v", err)
    }
    t.Logf("Raw response body: %s", w.Body.String())

    assert.Equal(t, http.StatusOK, w.Code)
    assert.NotZero(t, data.AvgTemp)
}

func TestGetStatWeatherData(t *testing.T) {
	r := testSetup.router
    handler := testSetup.handler
    r.GET("/data/stat/weather", handler.GetStatWeatherData)
    req, _ := http.NewRequest("GET", "/data/stat/weather", nil)
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)

    var data models.StatWeatherData
    err := UnmarshalResponse(w.Body.Bytes(), &data)
    if err != nil {
        t.Fatalf("Error unmarshaling response: %v", err)
    }
    t.Logf("Raw response body: %s", w.Body.String())

    assert.Equal(t, http.StatusOK, w.Code)
    assert.NotZero(t, data.AvgTemp)
}

func TestGetLatestWeatherData(t *testing.T) {
	r := testSetup.router
    handler := testSetup.handler
    r.GET("/data/latest/weather", handler.GetWeatherData)
    req, _ := http.NewRequest("GET", "/data/latest/weather", nil)
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)

    var data models.WeatherData
    err := UnmarshalResponse(w.Body.Bytes(), &data)
    if err != nil {
        t.Fatalf("Error unmarshaling response: %v", err)
    }
    t.Logf("Raw response body: %s", w.Body.String())

    assert.Equal(t, http.StatusOK, w.Code)
    assert.NotZero(t, data.Temp)
}

func TestGetLatestSensorData(t *testing.T) {
	r := testSetup.router
    handler := testSetup.handler
    r.GET("/data/latest/sensor", handler.GetWeatherData)
    req, _ := http.NewRequest("GET", "/data/latest/sensor", nil)
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)

    var data models.SensorData
    err := UnmarshalResponse(w.Body.Bytes(), &data)
    if err != nil {
        t.Fatalf("Error unmarshaling response: %v", err)
    }
    t.Logf("Raw response body: %s", w.Body.String())

    assert.Equal(t, http.StatusOK, w.Code)
    assert.NotZero(t, data.Temp)
}

func TestGetUserwithLatLon(t *testing.T){
	r := testSetup.router
	handler := testSetup.handler
	r.GET("/data/weather", handler.Get_weather_with_user_lon_lat)
	lat := "13.7563"
    lon := "100.5018"
    req, _ := http.NewRequest("GET", "/data/weather?lat="+lat+"&lon="+lon, nil)
	w := httptest.NewRecorder()
    r.ServeHTTP(w, req)


    t.Logf("Raw body: %s", w.Body.String())

    
    assert.Equal(t, http.StatusOK, w.Code)


    var response map[string]interface{}
    err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
    	t.Fatalf("Failed to unmarshal JSON: %v", err)
	}

    assert.Contains(t, response, "coord")
    assert.Contains(t, response, "main")
    assert.Contains(t, response, "weather")


}
