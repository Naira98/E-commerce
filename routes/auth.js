const express = require("express");
const { check, body } = require("express-validator");

const authControllers = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authControllers.getLogin);

router.get("/signup", authControllers.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password", "Password is not valid")
      .isLength({ min: 4 })
      .trim()
      .isAlphanumeric()
  ],
  authControllers.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDocs) => {
          if (userDocs) {
            return Promise.reject("Email already exists.");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a valid password with only chars and numbers and at least 4 charchters."
    )
      .isLength({ min: 4 })
      .trim()
      .isAlphanumeric(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      }),
  ],
  authControllers.postSignup
);

router.post("/logout", authControllers.postLogout);

router.get("/reset", authControllers.getReset);

router.post("/reset", authControllers.postReset);

router.get("/reset/:resetToken", authControllers.getNewPassword);

router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
