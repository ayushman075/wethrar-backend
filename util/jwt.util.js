import jwt from 'jsonwebtoken';


export const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};
