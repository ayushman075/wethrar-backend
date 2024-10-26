import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path:'.env'
})

const connection = mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

export default connection