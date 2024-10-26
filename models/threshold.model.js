import mongoose from 'mongoose';

const thresholdSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    parameter: {
        type: String,
        required: true
    },
    thresholdValue: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Threshold = mongoose.model('Threshold', thresholdSchema);
