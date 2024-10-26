import dotenv from "dotenv"
import { Location } from "../models/location.model.js";
import cron from 'node-cron';
import Weather from "../models/weather.model.js";
import axios from "axios";
import { Threshold } from "../models/threshold.model.js";
import sendWhatsappMessage from "./whatsapp.util.js";

dotenv.config({
    path:'.env'
})

export const fetchWeatherData = async (location) => {
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
        weatherEntry.save();

        return weatherEntry
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw new Error('Failed to fetch weather data');
    }
};

export const fetchWeatherDataSendMessage = async (location) => {
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
        weatherEntry.save();


        const userThresholds = await Threshold.find({ city:location }).populate('user', 'phone');
     
        for (const threshold of userThresholds) {
            
            const { user, city,parameter,thresholdValue} = threshold;

            // Check if any parameter exceeds the threshold
            if (parameter=='temperature' && temp > thresholdValue) {
                console.log(`Hey ${user.phone}, Your set threshold for Temperature exceded in ${city}. Current Temperature is ${temp} and your set threshold was ${thresholdValue}.`)
                await sendWhatsappMessage(user.phone,`Hey, Your set threshold for Temperature exceded in ${city}. Current Temperature is ${temp} and your set threshold was ${thresholdValue}.`)
                //await sendWhatsAppMessage(userId, `Alert! The temperature in ${location} is ${temp}°C, which exceeds your threshold of ${temperatureThreshold}°C.`);
            }
            if (parameter=='feelsLike' && feels_like > thresholdValue) {
                console.log(`Hey ${user.phone}, Your set threshold for Feels Like exceded in ${city}. Current Feels Like is ${feels_like} and your set threshold was ${thresholdValue}.`)
                await sendWhatsappMessage(user.phone,`Hey, Your set threshold for Feels Like exceded in ${city}. Current Feels Like is ${feels_like} and your set threshold was ${thresholdValue}.`)
                //await sendWhatsAppMessage(userId, `Alert! The feels like temperature in ${location} is ${feels_like}°C, which exceeds your threshold of ${feelsLikeThreshold}°C.`);
            }
            if (parameter=='windSpeed' && windSpeed > thresholdValue) {
                console.log(`Hey ${user.phone}, Your set threshold for Windspeed exceded in ${city}. Current Wind Speed is ${windSpeed} and your set threshold was ${thresholdValue}.`)
                await sendWhatsappMessage(user.phone,`Hey, Your set threshold for Windspeed exceded in ${city}. Current Wind Speed is ${windSpeed} and your set threshold was ${thresholdValue}.`)
                //await sendWhatsAppMessage(userId, `Alert! The wind speed in ${location} is ${windSpeed} m/s, which exceeds your threshold of ${windSpeedThreshold} m/s.`);
            }
            if (parameter=='rainProbaility' && rainProbability > thresholdValue) {
                console.log(`Hey ${user.phone}, Your set threshold for Rain Probability exceded in ${city}. Current Rain Probality is ${temp} and your set threshold was ${thresholdValue}.`)
                await sendWhatsappMessage(user.phone,`Hey, Your set threshold for Rain Probability exceded in ${city}. Current Rain Probality is ${temp} and your set threshold was ${thresholdValue}.`)
               // await sendWhatsAppMessage(userId, `Alert! The rain probability in ${location} is ${rainProbability}%, which exceeds your threshold of ${rainProbabilityThreshold}%.`);
            }
        }


        return weatherEntry
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw new Error('Failed to fetch weather data');
    }
};

const updateWeatherData = async () => {
    try {
        let locations = await Location.findOne();
        if (!locations) {
        locations = new Location();
        await locations.save();
    }
        for (const location of locations.locations) {
            const weatherData = await fetchWeatherData(location);
           
            console.log(`Weather data for ${location} updated successfully.`);
        }
    } catch (error) {
        console.error('Error during scheduled weather update:', error.message);
    }
};

const updateWeatherDataSendMessage = async () => {
    try {
        let locations = await Location.findOne();
        if (!locations) {
        locations = new Location();
        await locations.save();
    }
        for (const location of locations.locations) {
            const weatherData = await fetchWeatherDataSendMessage(location);
           
            console.log(`Weather data for ${location} updated successfully.`);
        }
    } catch (error) {
        console.error('Error during scheduled weather update:', error.message);
    }
};

//'*/5 * * * *'
cron.schedule('*/5 * * * *', () => {
    console.log('Running scheduled weather update...');
    updateWeatherData();
});
cron.schedule('0 */6 * * *', () => {
    console.log('Running scheduled send weather update...');
    updateWeatherDataSendMessage();
});

