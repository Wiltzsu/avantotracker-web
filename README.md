# 🧊 AvantroTracker Web

React frontend for tracking ice baths. Connects to a Laravel backend via an API.

## Live Demo
- Website: https://www.avantotracker.com
- API: https://api.avantotracker.com

## API
- Base URL: `https://api.avantotracker.com`
- Health check: `GET /` returns `{"message":"AvantoTracker API","status":"healthy",...}`
- Requires authentication for protected endpoints

## Features (so far)
- Modern React UI (SPA)
- Auth (register, login, logout) with Bearer tokens
- Create and manage avanto entries
- Responsive layout

## Tech
- React + React Router
- Axios (API client with interceptors)
- Backend: Laravel API (separate service)