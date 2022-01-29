const Joi = require('joi');

//Register Validation
const regValidation = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    surname: Joi.string().min(2).required(),
    userName: Joi.string().min(2).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

//Login Validation
const logValidation = (data: any) => {
  const schema = Joi.object({
    userName: Joi.string().min(2).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export { regValidation, logValidation };
