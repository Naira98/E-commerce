const express = require("express");

const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControllers.getLogin);

router.get("/signup", authControllers.getSignup);

router.post("/login", authControllers.postLogin);

router.post("/signup", authControllers.postSignup);

router.post("/logout", authControllers.postLogout);

module.exports = router;
