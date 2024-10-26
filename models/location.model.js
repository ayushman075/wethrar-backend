import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    locations: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

export const Location = mongoose.model('Location', LocationSchema);
