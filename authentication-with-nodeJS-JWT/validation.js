const Joi = require('joi');

// Validation
/*Joi is an object schema description language and validator for JavaScript objects.
Joi allows you to create blueprints or schemas for JavaScript objects to ensure validation of key information. */

//Register Validation
const regValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    surname: Joi.string().min(2).required(),
    userName: Joi.string().min(2).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const logValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(2).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.regValidation = regValidation;
module.exports.logValidation = logValidation;
