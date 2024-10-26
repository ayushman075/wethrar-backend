import express from 'express';
import { verifyJWT } from '../middlewares/verifyjwt.middleware.js';
import { addLocation, getCurrentUser, loginWithPhoneAndOtp, logout, removeLocation, requestOtp } from '../controllers/user.controller.js';

const userRouter = express.Router();


userRouter.post('/request-otp', requestOtp);


userRouter.post('/login', loginWithPhoneAndOtp);


userRouter.post('/logout', verifyJWT, logout);
userRouter.post('/getCurrentUser',verifyJWT,getCurrentUser)

userRouter.post('/location-add', verifyJWT, addLocation);
userRouter.post('/location-remove', verifyJWT, removeLocation);

export default userRouter;
