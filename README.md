# Project Overview

The Crops Recommendation System is an IoT + AI-based solution that assists farmers 
by recommending optimal crops to grow based on real-time environmental conditions. The system gathers live data from sensors and external sources, processes it through a machine learning model, and provides smart crop recommendations through a RESTful API. 

# Members
Napoldej Passornratchakul ID : 6610545243  
Sunthorn Kompita  ID : 6610545529 

# Web functionality

A web application that visualizes the historical data with line graph, statistical summaries, provides the weather information based on user location or specific place, and prediction soil moisture and recommendation crop type based on user input.

## API Features

### Core Functionality

- **Weather Data**:
  - Retrieves current weather data (e.g., temperature, humidity, wind speed) using OpenWeatherAPI based on latitude and longitude.
  - Retrieves the statistical of weather data
  - Retrieves the latest weather and the data that collected from sensor.


- **Predictive**:
  - Accepts input data such as temperature, humidity and soil moisture then returns a  recommended crops based on a machine learning model.
  - Accepts input data such as temperature and humidity  then returns soil moisture value based on a machine learning model.
 

### Endpoint Overview

#### 1. Weather Data Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data` | GET | Retrieve list of all sensor data  |
| `/data/stat/sensor` | GET | Get statistical summaries (avg, min, max) from sensors |
| `/data/stat/weather` | GET | Get statistical weather summaries (OpenWeather) |
| `/data/latest/weather` | GET | Get latest weather data from OpenWeather |
| `/data/latest/sensor` | GET | Get latest data from physical sensors |
| `/data/weather?lat=...&lon=...` | GET | Get weather data for a specific location |


#### 2. Predictive and Recommendation Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/predict-moisture` | POST | Predict soil moisture based on temperature and humidity |
| `/data/predict-crop` | POST | Predict crop suitability based on user input temperature, humidity and soil moisture |


### Key Technical Features

1. **Data Integration**:
   - Integration with KY-015 and ZX-SOIL sensors for real-time collection of temperature, humidity, and soil moisture data.
   - Uses OpenWeather API to fetch real-time weather data (wind speed, humidity, temperature) based on latitude and longitude.


2. **Data Pipeline**:
   - Sensor and weather data are transmitted through Node-RED for flow-based data processing.
   - Automatically pushes data every 10 minutes to the backend system.

3. **Database Management**:
   - Stores all sensor and weather data in a MySQL database, managed through phpMyAdmin.


4. **RESTful API**:
   - Developed Golang and FastAPI

5. **Recommendation and Predictive System**:
    - Logic or model for recommending suitable crops and soil moisture based on environmental data (e.g., temperature, soil moisture, humidity).

# Installation

### Download Golang
- [Go download](https://go.dev/doc/install) For any linux, window, and mac
## Alternative way (For mac and linux)
   ```bash
   brew install go #For mac book
   ```
   ```bash
   sudo apt update
   sudo apt install golang-go   #On Linux (using APT for Ubuntu/Debian):
   ```

   ```bash
   sudo snap install go --classic #On Linux (using Snap):
   ```

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SunthornK/crops-recommendation.git
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate # Windows
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Install Golang dependencies:
   ```bash
   go mod tidy
   ```
5. Database setup:   
   # Create .env file that contain like in the env.exameple.txt
   ```bash
   cd backend
   cp .env.example .env
   ```

### Frontend setup  
1. Install setup for frontend
   ```bash
    cd frontend
    npm install 
   ```

## How to run :
### For backend Golang Server:
   ```bash
   cd backend
   go run main.go 
   ```
### For backend Python Server:
   ```bash
   cd backend
   cd predict
   uvicorn main:app --reload
   ```
### For Frontend:
   ```bash
   cd frontend
   npm run dev
   ```


# OpenWeather API Access Guide
## Current Weather Data Integration  
https://openweathermap.org/current
### Prerequisites
1. OpenWeatherMap account
2. API key (obtained after registration)

### Getting Your API Key
1. Log in to your OpenWeatherMap account
2. Navigate to the "API Keys" tab
3. Copy your default key or generate a new one

### Making API Requests
Base Endpoint:  
https://api.openweathermap.org/data/2.5/weather

Required Parameters:  

| Parameter | Description   | Example Value      |
|-----------|---------------|--------------------|
| `lat`     | Latitude      | `13.123123`        |
| `lon`     | Longitude     | `150.1231`       |
| `appid`   | Your API key  | `your_api_key_here`|
