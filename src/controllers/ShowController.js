

const db = require("../models"); 

class ShowController {
  // Создание нового спектакля
  static async createShow(req, res) {
    try {
      const { title, genreId, description, showDate, ageLimit, price } =
        req.body;
      const newShow = await db.Show.create({
        title,
        genreId,
        description,
        showDate,
        ageLimit,
        price,
      });
      res.status(201).json(newShow);
    } catch (error) {
      console.error("Ошибка при создании спектакля:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Получение списка всех спектаклей
  static async getAllShows(req, res) {
    try {
      const shows = await db.Show.findAll({
        include: [
          {
            model: db.Genre,
            as: "genre",
          },
        ],
      });

      const message = req.session.message;
      delete req.session.message;

      res.render("shows", { shows: shows, message });
    } catch (error) {
      console.error("Ошибка при получении списка спектаклей:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Получение спектакля по ID
  static async getShowById(req, res) {
    try {
      const show = await db.Show.findByPk(req.params.id, {
        include: [{ model: db.Genre, as: "genre" }], // Добавляем жанр к спектаклю
      });
      if (show) {
        res.render("show", {
          title: show.title,
          show: show,
        });
      } else {
        res.status(404).send("Спектакль не найден");
      }
    } catch (error) {
      console.error("Ошибка при получении спектакля:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Обновление спектакля
  static async updateShow(req, res) {
    try {
      const { title, genreId, description, showDate, ageLimit, price } =
        req.body;
      const [updated] = await db.Show.update(
        {
          title,
          genreId,
          description,
          showDate,
          ageLimit,
          price,
        },
        {
          where: { id: req.params.id },
        }
      );
      if (updated) {
        const updatedShow = await db.Show.findByPk(req.params.id, {
          include: [db.Genre],
        });
        res.status(200).json(updatedShow);
      } else {
        res.status(404).send("Спектакль не найден");
      }
    } catch (error) {
      console.error("Ошибка при обновлении спектакля:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление спектакля
  static async deleteShow(req, res) {
    try {
      const id = req.params.id;
      const deleted = await db.Show.destroy({
        where: { id },
      });
      if (deleted) {
        res.status(200).send("Спектакль удален");
      } else {
        res.status(404).send("Спектакль не найден");
      }
    } catch (error) {
      console.error("Ошибка при удалении спектакля:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ShowController;
