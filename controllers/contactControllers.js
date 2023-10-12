const { Contact } = require("../models/contact");

const {
  addSchema,
  updateFavoriteSchema,
} = require("../utils/validation/contactValidationSchemas");

const { HttpError } = require("../utils/helpers/HttpError");

const { controllerWrapper } = require("../utils/decorators/ctrlWrapper");

const listContacts = controllerWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    const result = await Contact.find(
      { owner, favorite },
      "-crearedAt -updatedAt",
      {
        skip,
        limit,
      }
    ).populate("owner", "email");
    res.status(200).json(result);
    return;
  }

  const result = await Contact.find({ owner }, "-crearedAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.status(200).json(result);
});

const getContactById = controllerWrapper(async (req, res, next) => {
  const result = await Contact.findById(req.params.contactId);
  if (!result) {
    throw new HttpError(404, "Not Found");
  }
  res.status(200).json(result);
});

const addContact = controllerWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const { error } = addSchema.validate({ ...req.body, owner });

  if (error) {
    throw new HttpError(400, error.message);
  }

  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
});

const removeContact = controllerWrapper(async (req, res, next) => {
  const result = await Contact.findByIdAndRemove(req.params.contactId);

  if (!result) {
    throw new HttpError(404, "Not Found");
  }

  res.status(200).json({ message: "contact deleted" });
});

const updateContact = controllerWrapper(async (req, res, next) => {
  const { error } = addSchema.validate(req.query);

  if (error) {
    throw new HttpError(400, error.message);
  }

  const result = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.query,
    { new: true }
  );
  res.status(200).json(result);
});

const updateFavorite = controllerWrapper(async (req, res, next) => {
  const { error } = updateFavoriteSchema.validate(req.body);

  if (error) {
    throw new HttpError(400, error.message);
  }

  const result = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  res.status(200).json(result);
});

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
};
