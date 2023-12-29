import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';
import CustomError from '../utils/customError';

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = res.statusCode || HTTP_STATUS.SERVER_ERROR;
    
    switch(statusCode) {
        case HTTP_STATUS.BAD_REQUEST:
            if (err instanceof CustomError) {
                res.json({
                    title: "Validation Error",
                    message: "One or more Entries don't have valid request",
                    details: err.details
                });
            } else {
                res.json({
                    title: "Bad Request",
                    message: err.message,
                    details: []
                });
            }
            
            break;

        case HTTP_STATUS.NOT_FOUND:
            res.json({
                title: "Record/s not found",
                message: err.message,
                details: []
            });
            break;
        
        case HTTP_STATUS.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: err.message,
                details: []
            });
            break;

        default:
            break;
    }
    
};
