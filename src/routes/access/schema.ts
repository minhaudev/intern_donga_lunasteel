import Joi from 'joi';
import { JoiAuthBearer } from '../../helpers/validator';

const newPasswordSchema = Joi.string()
  .min(6)
  .pattern(
    new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
    ),
  )
  .required()
  .messages({
    'string.pattern.base': `Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&)`,
  });

const newEmailSchema = Joi.string()
  .pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'))
  .required()
  .messages({
    'string.pattern.base': `email is not in the correct format`,
  });

export default {
  newPassword: newPasswordSchema,
  credential: Joi.object().keys({
    email: newEmailSchema,
    password: newPasswordSchema,
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: newEmailSchema,
    password: newPasswordSchema,
    roles: Joi.array(),
    teams: Joi.array(),
  }),

  newpassword: Joi.object().keys({
    newPassword: newPasswordSchema,
  }),
  sendemailforgetpassword: Joi.object().keys({
    email: newEmailSchema,
  }),
  token: Joi.object().keys({
    token: Joi.string().required().min(1),
  }),
};
