

const db = require("../models"); 

class GenreController {
  // Создание нового жанра
  static async createGenre(req, res) {
    try {
      const { name } = req.body;
      const newGenre = await db.Genre.create({ name });
      res.status(201).json(newGenre);
    } catch (error) {
      console.error("Ошибка при создании жанра:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Получение списка всех жанров
  static async getAllGenres(req, res) {
    try {
      const genres = await db.Genre.findAll();
      res.status(200).json(genres);
    } catch (error) {
      console.error("Ошибка при получении списка жанров:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Получение жанра по ID
  static async getGenreById(req, res) {
    try {
      const genre = await db.Genre.findByPk(req.params.id);
      if (genre) {
        res.status(200).json(genre);
      } else {
        res.status(404).send("Жанр не найден");
      }
    } catch (error) {
      console.error("Ошибка при получении жанра:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Обновление жанра
  static async updateGenre(req, res) {
    try {
      const { name } = req.body;
      const [updated] = await db.Genre.update(
        { name },
        {
          where: { id: req.params.id },
        }
      );
      if (updated) {
        const updatedGenre = await db.Genre.findByPk(req.params.id);
        res.status(200).json(updatedGenre);
      } else {
        res.status(404).send("Жанр не найден");
      }
    } catch (error) {
      console.error("Ошибка при обновлении жанра:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление жанра
  static async deleteGenre(req, res) {
    try {
      const id = req.params.id;
      const deleted = await db.Genre.destroy({
        where: { id },
      });
      if (deleted) {
        res.status(200).send("Жанр удален");
      } else {
        res.status(404).send("Жанр не найден");
      }
    } catch (error) {
      console.error("Ошибка при удалении жанра:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = GenreController;
