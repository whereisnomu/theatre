const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/GenreController");

// Получение списка всех жанров
router.get("/genres", GenreController.getAllGenres);

// Создание нового жанра
router.post("/genres", GenreController.createGenre);

// Редактирование существующего жанра по ID
router.put("/genres/:id", GenreController.updateGenre);

// Удаление жанра по ID
router.delete("/genres/:id", GenreController.deleteGenre);

module.exports = router;
