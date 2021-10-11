import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  APP_AUTHOR: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  APP_PROD: Joi.boolean().required(),
  APP_SECRET: Joi.string().required(),
  MESSAGE_BROKER_HOST: Joi.string().required(),
  MESSAGE_BROKER_PORT: Joi.number().required(),
  MESSAGE_BROKER_USER: Joi.string().required(),
  MESSAGE_BROKER_PASS: Joi.string().required(),
  LOGS_QUEUE: Joi.string().required(),
  LOG_EVENT_PATTERN: Joi.string().required(),
  CUSTOMER_HOST: Joi.string().required(),
  CUSTOMER_PORT: Joi.number().required(),
  WEBHOOK_QUEUE: Joi.string().required(),
});
