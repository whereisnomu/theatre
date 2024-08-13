const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Регистрация пользователя
router.post("/register", AuthController.register);

router.get("/register", AuthController.optionalAuthentication, (req, res) => {
  res.render("register", {
    title: "Регистрация",
    user: req.user,
    message: req.session.message,
    error: req.session.error,
  });
  delete req.session.message;
  delete req.session.error;
});

// Вход пользователя
router.post("/login", AuthController.login);

router.get("/login", AuthController.optionalAuthentication, (req, res) => {
  res.render("login", { user: req.user, message: req.session.message });
  delete req.session.message;
});

// Выход пользователя
router.post("/logout", AuthController.logout);

module.exports = router;
