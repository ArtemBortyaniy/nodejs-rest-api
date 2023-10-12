const {
  addSchema,
  schemaUpdateFavorite,
} = require("../validation/authValidationSchema");

const { HttpError } = require("../helpers/HttpError");

const useSchema = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }
  } catch (error) {
    next(error);
  }

  next();
};

const useSchemaUpdateFavorite = async (req, res, next) => {
  try {
    const { error } = schemaUpdateFavorite.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }
  } catch (error) {
    next(error);
  }

  next();
};

module.exports = { useSchema, useSchemaUpdateFavorite };
