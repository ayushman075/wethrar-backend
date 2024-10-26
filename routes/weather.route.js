import express from 'express';
import { verifyJWT } from '../middlewares/verifyjwt.middleware.js';
import { addLocation, generateWeatherReport, getAllLocationWeather, getWeatherAndStore } from '../controllers/weather.controller.js';

const weatherRouter = express.Router();


weatherRouter.post('/get', getWeatherAndStore);

weatherRouter.get('/weatherReport',generateWeatherReport)

weatherRouter.get('/allLocationWeatherReport',verifyJWT,getAllLocationWeather)

weatherRouter.post('/add-location',verifyJWT, addLocation);


export default weatherRouter;
