import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    feelsLike: {
        type: Number,
        required: true,
    },
    windSpeed: {
        type: Number,
        required: true,
    },
    rainProbability: {
        type: Number,
        required: false,
    },
    main: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather