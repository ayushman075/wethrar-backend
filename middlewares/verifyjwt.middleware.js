import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { asyncHandler } from '../util/AsyncHandler.util.js';
import { ApiResponse } from '../util/ApiResponse.util.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json(new ApiResponse(401,{token},"Unautorized Request !!"))
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        const user = await User.findById(decodedToken._id).select('-refreshToken');

        if (!user) {
            return res.status(401).json(new ApiResponse(401,{},"Invalid Access token, Please try login 2!!"))
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ApiResponse(401,{},"Invalid Access token, Please try login 3!!"))
    }
});
