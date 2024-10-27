# Weather Monitoring Application - Backend

This is the backend for the Weather Monitoring Application, built with Node.js, Express, and MongoDB. It provides APIs for retrieving weather data, managing cities, and storing user preferences.

## Features

- **Weather Data Retrieval**: Provides endpoints to fetch weather details for various cities.
- **City Management**: APIs for adding and managing city information.
- **User Threshold Alerts**: Supports sending WhatsApp notifications based on user-defined weather parameter thresholds.
- **RESTful API Design**: Follows REST principles for API structure.

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**

## Installation

### Prerequisites

- Node.js
- MongoDB

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushman075/wethrar-backend
   cd weather-backend
   npm install

2. **Configure .env file**
    PORT=5000
    MONGODB_URI=
    OPENWEATHERMAP_API_KEY=
    ACCESS_TOKEN=
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN=
    REFRESH_TOKEN_EXPIRY=30d
    RAPIWHA_API=
    CORS_ORIGIN=*


3. **Start the server**
   ```bash
   nodemon index.js


The backend of the Weather Monitoring Application offers a robust solution for serving weather data and managing city information, while also providing user notifications for specific weather conditions. Built with Node.js, Express, and MongoDB, the backend ensures efficient data handling and reliable performance. This project demonstrates how to integrate weather data retrieval, city management, and alerting mechanisms in a scalable RESTful API. Contributions are encouraged, as continuous development and community feedback can help enhance the application's capabilities.
