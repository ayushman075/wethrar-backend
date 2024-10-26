import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiresIn: { type: Date },
    refreshToken: { type: String },
    locations: {
        type: [String],
        default: [],
    },
    isVerified: { type: Boolean, default: false }
    // Add other fields as needed
});

const User = mongoose.model('User', userSchema);
export default User;
