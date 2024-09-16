import Joi from 'joi';
import { Header } from '../core/utils';
import { JoiAuthBearer } from '../helpers/validator';

export default {
  apiKey: Joi.object()
    .keys({
      [Header.API_KEY]: Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
});

export const checkPasswordSchema = Joi.object({
  token: Joi.string().required().label('Token'),
});

export const updatePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().label('New Password'),
  conformPassword: Joi.string().min(6).required().label('Confirm Password'),
});
