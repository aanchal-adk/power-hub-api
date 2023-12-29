import { ValidationErrorItem } from 'joi';

class CustomError extends Error {
    details: ValidationErrorItem[];

    constructor(details: ValidationErrorItem[], message: string) {
        super(message);
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
