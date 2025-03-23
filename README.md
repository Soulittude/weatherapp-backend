# Weather App Backend

MERN stack backend for weather application with user authentication and search history.

## Features
- JWT Authentication
- OpenWeatherMap API integration
- Search history tracking
- Rate limiting
- Swagger API documentation

## Setup

### 1. Install dependencies

```npm install```

### 2. Create .env file

```
MONGODB_URI=your_mongodb_uri
OPENWEATHER_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1h
PORT=5000
```
### 3. Start server

```npm start```
## API Endpoints
POST /api/auth/register - User registration

```POST /api/auth/login``` - User login

```GET /api/weather/:location``` - Get weather data

```GET /api/history``` - Get search history (protected)

```POST /api/history``` - Save search (protected)

Access Swagger docs at ```/api-docs``` when running locally.
