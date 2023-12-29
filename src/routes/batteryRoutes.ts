import express, { Request, Response } from 'express';
import { getBatteries, createBatteries } from '../controllers/batteryController';

const router = express.Router();

router.route('/').get(getBatteries).post(createBatteries);


export default router;