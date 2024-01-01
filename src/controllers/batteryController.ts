import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';
import { BatteryInfo } from '../interfaces/battery';
import { batteriesSchema } from '../schemas/batterySchema';
import CustomError from '../utils/customError';
import Battery from '../models/batteryModel';
import { parseAndValidateFilter } from '../utils/request';

export const getBatteries = async (req: Request, res: Response, next: NextFunction) => {

    const { pc_start, pc_end, gte_cap, lte_cap, search } = req.query;
    
    let pcStart: number | undefined;
    let pcEnd: number | undefined;
    let gteCap: number | undefined;
    let lteCap: number | undefined;
    
    try {

        if (typeof pc_start === 'string') pcStart = parseAndValidateFilter(pc_start, 'pc_start');
        if (typeof pc_end === 'string') pcEnd = parseAndValidateFilter(pc_end, 'pc_end');
        if (typeof gte_cap === 'string') gteCap = parseAndValidateFilter(gte_cap, 'gte_cap');
        if (typeof lte_cap === 'string') lteCap = parseAndValidateFilter(lte_cap, 'lte_cap');
    } catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST);
        next(error);
        return;
    }

    let query_params = [];

    if (pcStart || pcEnd) {
        let q1: {postalCode: {$gte?:number;$lte?:number;}} = {
            postalCode: {}
        };

        if (pcStart) {
            q1.postalCode['$gte'] = pcStart
        }

        if (pcEnd) {
            q1.postalCode['$lte'] = pcEnd
        }

        query_params.push(q1);
    }

    if (gteCap || lteCap) {
        let q2: {capacity: {$gte?:number;$lte?:number;}} = {
            capacity: {}
        };

        if (gteCap) {
            q2.capacity['$gte'] = gteCap
        }

        if (lteCap) {
            q2.capacity['$lte'] = lteCap
        }

        query_params.push(q2);
    }

    if (typeof search === 'string') {
        const regexPattern = new RegExp(search, 'i');
        query_params.push({
            name: {
                $regex: regexPattern
            }
        });
    }
    
    const findQuery = query_params.length > 0 ? {
        $and: query_params
    } : {};

    try {

        const batteries = await Battery.find(findQuery).sort({ name: 1 });
    
        let totalWattCapacity = 0;
        batteries.forEach((battery) => {
          totalWattCapacity += battery.capacity;
        });
    
        const averageWattCapacity =
          batteries.length > 0 ? parseFloat((totalWattCapacity / batteries.length).toFixed(2)) : 0;
    
        res.status(HTTP_STATUS.OK).json({
          batteries: batteries,
          totalWattCapacity,
          averageWattCapacity,
        });
      } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.SERVER_ERROR);
            next(new Error("Encountered a server error while fetching the battery list. Please Try again later."));

      }
};


export const createBatteries = async (req: Request<{}, {}, BatteryInfo[]>, res: Response ,next: NextFunction) => {
    try {
        const batteries = req.body;
        const validationResult = batteriesSchema.validate(batteries, { abortEarly: false });

        if (validationResult.error) {
            res.status(HTTP_STATUS.BAD_REQUEST);
            throw new CustomError(validationResult.error.details, "One or more Entries don't have valid request");
        }
    
        await Battery.insertMany(batteries);
        console.log(`${batteries.length} battery entries inserted successfully!`);
        res.status(HTTP_STATUS.CREATED).json({
            message: "created"
        });
    } catch (err) {
        if (err instanceof CustomError) {
            next(err);
        } else {
            res.status(HTTP_STATUS.SERVER_ERROR);
            console.error(err);
            next(new Error("Encountered a server error while inserting entries into the database. Please Try again later."));
        }
    }
};

