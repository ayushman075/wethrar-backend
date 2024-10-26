import User from '../models/user.model.js';
import { generateAccessToken,generateRefreshToken } from '../util/jwt.util.js';
import { asyncHandler } from '../util/AsyncHandler.util.js';
import { ApiResponse } from '../util/ApiResponse.util.js';
import sendWhatsappMessage from '../util/whatsapp.util.js';


const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();



const requestOtp = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(409).json(new ApiResponse(409,{},"Phone Number is required !!"))
    }

  
    const otp = generateOtp();
    const otpExpiresIn = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ phone });

    if (!user) {
         user = new User({ phone, otp, otpExpiresIn });
    } else {
        user.otp = otp;
        user.otpExpiresIn = otpExpiresIn;
    }

    
    await user.save();

    const message = sendWhatsappMessage(phone,`Hey, Use this OTP to login to Wethrar is ${otp}. Please note this OTP is valid for 10 minutes.`)
    if(!message){
        return res.status(500).json(new ApiResponse(500,{},"Error sending OTP !!"));
    }

    res.status(200).json(new ApiResponse(200,{},"OTP sent successfully !!"));
});


const loginWithPhoneAndOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(409).json(new ApiResponse(409,{},"Phone Number and OTP is required !!"))
    }

    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp || user.otpExpiresIn < new Date()) {
       return res.status(409).json(new ApiResponse(409,{},"Invalid OTP, user not found, or OTP has expired !!"))
        }

   
    user.otp = null;
    user.otpExpiresIn = null;
    user.isVerified = true;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();


    const options={
        httpOnly: true,
        secure: false, // Change to 'false' for local development
        sameSite: 'Strict',
        path: '/'
     }

   return res.status(200).cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{},"Login successfully !!"));
});




const logout = asyncHandler(async (req, res) => {
    

    const options={
        httpOnly: true,
        secure: false, // Change to 'false' for local development
        sameSite: 'Strict',
        path: '/'
     }


   
    const user = await User.findById( req.user._id );

    if (!user) {
        return res.status(404).json(new ApiResponse(404,{},"User not found !!"));
    }

  
    user.refreshToken = null;
    await user.save();

  
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    res.status(200).json(new ApiResponse(404,{},"User logged out successfully !!"));
});

const getCurrentUser =asyncHandler(async (req,res) => {
    const user = await User.findById( req.user._id );
   return res.status(200).json(new ApiResponse(200,user,"User fetched successfully !!"));

})

const addLocation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { location } = req.body;

    if (!location) {
        return res.status(400).json(new ApiResponse(400, {}, "Location is required"));
    }

    const user = await User.findById(userId);
    if (user.locations.includes(location)) {
        return res.status(400).json(new ApiResponse(400, {}, "Location already exists"));
    }

    user.locations.push(location);
    await user.save();

    return res.status(200).json(new ApiResponse(200, { locations: user.locations }, "Location added successfully"));
});

const removeLocation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { location } = req.body;

    if (!location) {
        return res.status(400).json(new ApiResponse(400, {}, "Location is required"));
    }


    const user = await User.findById(userId);
    const locationIndex = user.locations.indexOf(location);

    if (locationIndex === -1) {
        return res.status(404).json(new ApiResponse(404, {}, "Location not found"));
    }


    user.locations.splice(locationIndex, 1);
    await user.save();

    return res.status(200).json(new ApiResponse(200, { locations: user.locations }, "Location removed successfully"));
});


export {requestOtp,loginWithPhoneAndOtp,logout,addLocation,removeLocation,getCurrentUser}