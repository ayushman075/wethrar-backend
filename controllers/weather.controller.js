import axios from 'axios';
import { asyncHandler } from '../util/AsyncHandler.util.js';
import { ApiResponse } from '../util/ApiResponse.util.js';
import Weather from '../models/weather.model.js';
import { Location } from '../models/location.model.js';
import User from '../models/user.model.js';


const getWeatherAndStore = asyncHandler(async (req, res) => {
    const { location } = req.body;

    try {
        
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const weatherData = response.data;

        const { temp, feels_like } = weatherData.main;
        const windSpeed = weatherData.wind.speed;
        const rainProbability = weatherData.rain ? weatherData.rain['1h'] : 0;
        const main = weatherData.weather[0].main;
        const timestamp = new Date(weatherData.dt * 1000);


        const weatherEntry = new Weather({
            location,
            temperature: temp,
            feelsLike: feels_like,
            windSpeed,
            rainProbability,
            main,
            timestamp
        });


        

        
        res.status(201).json(new ApiResponse(201, { weather: weatherEntry }, "Weather data fetched and stored successfully."));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, {}, "Error fetching weather data."));
    }
});


const getAllLocationWeather = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user || !user.locations || user.locations.length === 0) {
            return res.status(404).json(new ApiResponse(404, {}, "User not found or locations array is empty."));
        }

        const locations = user.locations;
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const weatherDataArr = [];

        await Promise.all(
            locations.map(async (location) => {
                try {
                    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
                    const response = await axios.get(url);
                    const weatherData = response.data;

                    const { temp, feels_like } = weatherData.main;
                    const windSpeed = weatherData.wind.speed;
                    const rainProbability = weatherData.rain ? weatherData.rain['1h'] : 0;
                    const main = weatherData.weather[0].main;
                    const timestamp = new Date(weatherData.dt * 1000);

                    weatherDataArr.push({
                        location,
                        temperature: temp,
                        feelsLike: feels_like,
                        windSpeed,
                        rainProbability,
                        main,
                        timestamp,
                    });
                } catch (error) {
                    console.error(`Error fetching weather for ${location}:`, error.message);
                }
            })
        );

        res.status(201).json(new ApiResponse(201, { weather: weatherDataArr }, "Weather data fetched successfully."));
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json(new ApiResponse(500, {}, "Error fetching weather data."));
    }
});


const addLocation = asyncHandler(async (req, res) => {
    const { location } = req.body;

    let locations = await Location.findOne();
    if (!locations) {
        locations = new Location();
    }

    if (locations.locations.includes(location)) {
        return res.status(200).json(new ApiResponse(200, locations.locations, 'Location already exists, no changes made.'));
    }

    locations.locations.push(location);
    await locations.save();

    res.status(200).json(new ApiResponse(200, locations.locations, 'Location added successfully.'));
});

const generateWeatherReport = asyncHandler(async (req, res) => {
    const { city } = req.query;
    const startDate = new Date();

    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() - 7);
    
    const monthStartDate = new Date(startDate);
    monthStartDate.setDate(startDate.getDate() - 30);
    
    const dayStartDate = new Date(startDate);
    dayStartDate.setHours(startDate.getHours() - 24);

    const dailyData = await Weather.find({
        location: city,
        timestamp: { $gte: dayStartDate }
    }).lean();
    
    const weeklyData = await Weather.find({
        location: city,
        timestamp: { $gte: weekStartDate }
    }).lean();
    
    const monthlyData = await Weather.find({
        location: city,
        timestamp: { $gte: monthStartDate }
    }).lean();

    const calculateStats = (data) => {
        if (data.length === 0) return {};

        const totalTemp = data.reduce((acc, curr) => acc + curr.temperature, 0);
        const totalFeelsLike = data.reduce((acc, curr) => acc + curr.feelsLike, 0);
        const totalWindSpeed = data.reduce((acc, curr) => acc + curr.windSpeed, 0);
        
        const maxTemp = Math.max(...data.map(d => d.temperature));
        const minTemp = Math.min(...data.map(d => d.temperature));
        const maxWindSpeed = Math.max(...data.map(d => d.windSpeed));
        
        return {
            averageTemp: (totalTemp / data.length).toFixed(2),
            averageFeelsLike: (totalFeelsLike / data.length).toFixed(2),
            averageWindSpeed: (totalWindSpeed / data.length).toFixed(2),
            maxTemp,
            minTemp,
            maxWindSpeed
        };
    };

    const dailyStats = calculateStats(dailyData);
    const weeklyStats = calculateStats(weeklyData);
    const monthlyStats = calculateStats(monthlyData);

    return res.status(200).json(new ApiResponse(200, {
        city,
        dailyStats,
        weeklyStats,
        monthlyStats
    }, "Weather report generated successfully"));
});


export {getWeatherAndStore,addLocation,generateWeatherReport,getAllLocationWeather}