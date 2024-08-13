const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/TicketController");

// Получение списка всех билетов
router.get("/tickets", TicketController.getAllTickets);

// Получение информации о билете по ID
router.get("/tickets/:id", TicketController.getTicketById);

// Создание нового билета
router.post("/tickets", TicketController.createTicket);

// Обновление билета по ID
router.put("/tickets/:id", TicketController.updateTicket);

// Удаление билета по ID
router.delete("/tickets/:id", TicketController.deleteTicket);

module.exports = router;
