const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const showRoutes = require("./showRoutes");
const ticketRoutes = require("./ticketRoutes");
const genreRoutes = require("./genreRoutes");
const orderRoutes = require("./orderRoutes");

router.use(AuthController.optionalAuthentication);

router.use((req, res, next) => {
  res.locals.user = req.user; // Добавляем user к локальным переменным, доступным в шаблонах
  next();
});

// Подключение роутеров
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/", showRoutes);
router.use("/tickets", ticketRoutes);
router.use("/genres", genreRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
