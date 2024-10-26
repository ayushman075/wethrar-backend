import express from 'express';
import { verifyJWT } from '../middlewares/verifyjwt.middleware.js';
import { deleteThreshold, getUserThresholds, setThreshold } from '../controllers/threshold.controller.js';

const thresholdRouter = express.Router();


thresholdRouter.post('/set',verifyJWT, setThreshold);

thresholdRouter.get('/get',verifyJWT,getUserThresholds)


thresholdRouter.post('/delete',verifyJWT, deleteThreshold);


export default thresholdRouter;
