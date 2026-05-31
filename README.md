# AI-Powered Weather Intelligence Platform

A full-stack weather intelligence that provides real-time weather forecasts, 5-day weather predictions, geolocation-based weather detection, weather analytics, CRUD functionality, and interactive visualizations using modern web technologies.

---

## Project Overview

This application allows users to search for weather information using:
- City names
- ZIP/Postal codes
- Landmarks

The platform retrieves real-time weather data from external APIs, stores user search history in a PostgreSQL database, and provides analytics, visualizations, and intelligent weather insights.


---

## Features

### Frontend Features
- Real-time weather search
- Current location weather detection
- 5-day weather forecast
- Responsive design for desktop/tablet/mobile
- Weather condition icons
- Interactive analytics dashboard
- Smart weather recommendations
- Error handling and validation
- Loading states and skeletons
- Dark/light mode support

### Backend Features
- RESTful API architecture
- CRUD operations for weather searches
- PostgreSQL database persistence
- Data validation using Zod
- Export weather data to JSON/CSV
- API integrations
- Error handling middleware

---

## Steps to run

## Step 1 — Clone the repo
 
```bash
git clone https://github.com/vuchau0802/ai-powered-weather-intelligence-platform.git
cd ai-powered-weather-intelligence-platform
```

 ## Step 2 — Set up the Backend
 
```bash
cd backend
notepad .env

# Open backend/.env and replace the placeholders
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
OPENWEATHER_API_KEY=your_key_here
OPENCAGE_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
ENABLE_GEOCODING=true
ENABLE_AIR_QUALITY=true
ENABLE_YOUTUBE=true

# Install dependencies
npm install

# Generate the Prisma
npm run db:generate

# Create the database table
npm run db:ensure

# Start the backend dev server
npm run dev
# Backend is now running at http://localhost:5000
```
 

---

## Error Handling

- The app handles errors gracefully by showing clear messages to the user instead of failing silently. For example, if the user searches without entering a city, the app displays a “City required” message. If the user enters an invalid or unknown city, the backend returns a 404 response and the frontend shows “City not found” with guidance to check the spelling and try again.

- The app also handles API failures. If the weather service is unavailable or the API key is rejected, the backend returns a clean error response, and the frontend displays “Weather request failed” so the user understands the problem and can try again later.
