const express = require("express");

const router = express.Router();

const {
  useSchema,
  useSchemaUpdateFavorite,
  useEmailSchema,
} = require("../../utils/auth/useSchema");
const { useValidationEmail } = require("../../utils/auth/useValidationEmail");
const { verifyToken } = require("../../middlewares/verifyToken");
const { upload } = require("../../middlewares/upload");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/authControllers");

router.post("/register", useSchema, useValidationEmail, registerUser);

router.get("/verify/:verificationCode", verifyEmail);

router.post("/verify/", useEmailSchema, resendVerifyEmail);

router.post("/login", useSchema, loginUser);

router.get("/current", verifyToken, getCurrentUser);

router.post("/logout", verifyToken, logoutUser);

router.patch("/", verifyToken, useSchemaUpdateFavorite, updateSubscription);

router.patch("/avatars", verifyToken, upload.single("avatar"), updateAvatar);

module.exports = router;
