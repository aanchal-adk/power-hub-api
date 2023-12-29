import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { BatteryInfo } from '../interfaces/battery';
import { batteriesSchema } from '../schemas/batterySchema';
import CustomError from '../utils/customError';

export const getBatteries = (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json([{
        name: 'B1',
        capacity: 400,
        postalCode: 44600
    },{
        name: 'B2',
        capacity: 340,
        postalCode: 35200
    }]);
};


export const createBatteries = (req: Request<{}, {}, BatteryInfo[]>, res: Response) => {
    const validationResult = batteriesSchema.validate(req.body, { abortEarly: false });

    if (validationResult.error) {
        res.status(HTTP_STATUS.BAD_REQUEST);
        console.log(validationResult.error.details);
        throw new CustomError(validationResult.error.details, "Validation Error"); // better to create a custom error to pass object
    }

    res.status(HTTP_STATUS.CREATED).json({
        message: "created"
    });
};
