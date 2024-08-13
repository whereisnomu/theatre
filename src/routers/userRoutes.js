const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Получение списка всех пользователей
router.get("/", UserController.getAllUsers);

// Получение информации о пользователе по ID
router.get("/:id", UserController.getUserById);

// Создание нового пользователя
router.post("/", UserController.createUser);

router.post("/:userId/cart", UserController.addTicketToCart);
router.get("/:userId/cart", UserController.viewCart);
router.post(
  "/:userId/cart/:ticketId/remove",
  UserController.removeTicketFromCart
);
router.post("/:userId/checkout", UserController.checkoutCart);

// Обновление пользователя по ID
router.put("/:id", UserController.updateUser);

// Удаление пользователя по ID
router.delete("/:id", UserController.deleteUser);

module.exports = router;
