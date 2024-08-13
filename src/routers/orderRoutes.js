const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

// Получение списка всех заказов
router.get("/orders", OrderController.getAllOrders);

// Получение одного заказа по ID
router.get("/orders/:id", OrderController.getOrderById);

// Создание нового заказа
router.post("/orders", OrderController.createOrder);

// Обновление заказа по ID
router.put("/orders/:id", OrderController.updateOrder);

// Удаление заказа по ID
router.delete("/orders/:id", OrderController.deleteOrder);

module.exports = router;
