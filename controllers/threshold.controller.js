import { Threshold } from "../models/threshold.model.js";
import { ApiResponse } from "../util/ApiResponse.util.js";
import { asyncHandler } from "../util/AsyncHandler.util.js";



const setThreshold = asyncHandler(async (req, res) => {
    const  user  = req.user;
    const { city, parameter, thresholdValue } = req.body;

    if(!city || !parameter || !thresholdValue){
       return res.status(409).json(new ApiResponse(409, {}, 'Some fields are empty !!'));
    }

    let threshold = await Threshold.findOne({ user:user._id, city, parameter });

    if (threshold) {
        threshold.thresholdValue = thresholdValue;
        await threshold.save();
    } else {
        threshold = new Threshold({ user:user._id, city, parameter, thresholdValue });
        await threshold.save();
    }

    res.status(200).json(new ApiResponse(200, threshold, 'Threshold set successfully'));
});



const getUserThresholds = asyncHandler(async (req, res) => {
    const  user  = req.user;
    const thresholds = await Threshold.find({ user:user._id });

    res.status(200).json(new ApiResponse(200, thresholds, 'User thresholds retrieved successfully'));
});




const deleteThreshold = asyncHandler(async (req, res) => {
    const  user  = req.user;
    const { city, parameter } = req.body;

    const threshold = await Threshold.findOneAndDelete({ user:user._id, city, parameter });

    if (!threshold) {
        return res.status(404).json(new ApiResponse(404, {}, 'Threshold not found'));
    }

    res.status(200).json(new ApiResponse(200, {}, 'Threshold deleted successfully'));
});

export {setThreshold,getUserThresholds,deleteThreshold}