const express = require("express");

const router = express.Router();

const {
  useSchema,
  useSchemaUpdateFavorite,
} = require("../../utils/auth/useSchema");
const { useValidationEmail } = require("../../utils/auth/useValidationEmail");
const { verifyToken } = require("../../middlewares/verifyToken");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
} = require("../../controllers/authControllers");

router.post("/register", useSchema, useValidationEmail, registerUser);

router.post("/login", useSchema, loginUser);

router.get("/current", verifyToken, getCurrentUser);

router.post("/logout", verifyToken, logoutUser);

router.patch("/", verifyToken, useSchemaUpdateFavorite, updateSubscription);

module.exports = router;
