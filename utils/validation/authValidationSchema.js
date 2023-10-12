const Joi = require("joi");

const addSchema = Joi.object({
  password: Joi.string().required("Set password for user"),
  email: Joi.string().required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .messages({
      "any.only": "Invalid subscription type",
    }),
  token: Joi.string(),
});

const schemaUpdateFavorite = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .messages({
      "any.only": "Invalid subscription type",
    })
    .required(),
});

module.exports = { addSchema, schemaUpdateFavorite };
