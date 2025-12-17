import joi from 'joi';

export const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  name: joi.string().min(2).optional(),
});