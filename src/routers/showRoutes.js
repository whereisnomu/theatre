const express = require("express");
const router = express.Router();
const ShowController = require("../controllers/ShowController");

// Получение списка всех спектаклей
router.get("/", ShowController.getAllShows);

// Получение информации о спектакле по ID
router.get("/:id", ShowController.getShowById);

// Создание нового спектакля
router.post("/", ShowController.createShow);

// Обновление спектакля по ID
router.put("/:id", ShowController.updateShow);

// Удаление спектакля по ID
router.delete("/:id", ShowController.deleteShow);

module.exports = router;
