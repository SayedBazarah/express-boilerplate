import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});


export const verifyLogin2faSchema = Joi.object({
  tempToken: Joi.string().required(),
  code: Joi.string().length(6).required(),
});
export const verify2faSchema = Joi.object({
  secret: Joi.string().required(),
  token: Joi.string().length(6).required(),
});
