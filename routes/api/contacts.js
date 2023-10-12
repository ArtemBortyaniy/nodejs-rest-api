const express = require("express");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
} = require("../../controllers/contactControllers");

const { verifyToken } = require("../../middlewares/verifyToken");

router.get("/", verifyToken, listContacts);

router.get("/:contactId", verifyToken, isValidId, getContactById);

router.post("/", verifyToken, addContact);

router.delete("/:contactId", verifyToken, isValidId, removeContact);

router.put("/:contactId", verifyToken, isValidId, updateContact);

router.patch("/:contactId/favorite", verifyToken, isValidId, updateFavorite);

module.exports = router;
