# AI-Powered Weather Intelligence Platform

A full-stack weather intelligence and analytics platform that provides real-time weather forecasts, 5-day weather predictions, geolocation-based weather detection, weather analytics, CRUD functionality, and interactive visualizations using modern web technologies.

---

## Project Overview

This application allows users to search for weather information using:
- City names
- ZIP/Postal codes
- GPS coordinates
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

## Error Handling

- The app handles errors gracefully by showing clear messages to the user instead of failing silently. For example, if the user searches without entering a city, the app displays a “City required” message. If the user enters an invalid or unknown city, the backend returns a 404 response and the frontend shows “City not found” with guidance to check the spelling and try again.

- The app also handles API failures. If the weather service is unavailable or the API key is rejected, the backend returns a clean error response, and the frontend displays “Weather request failed” so the user understands the problem and can try again later.
