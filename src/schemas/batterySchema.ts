import Joi from 'joi';

export const batterySchema = Joi.object({
    name: Joi.string().required(),
    capacity: Joi.number().required(),
    postalCode: Joi.number().required()
});

export const batteriesSchema = Joi.array().items(batterySchema);
