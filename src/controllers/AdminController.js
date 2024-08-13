const db = require("../models"); // Импорт моделей
const bcrypt = require("bcryptjs");

class AdminController {
  // Получение списка всех пользователей
  static async getAllUsers(req, res) {
    try {
      const users = await db.User.findAll();

      const message = req.session.message;
      delete req.session.message;

      res.render("admin/users", {
        title: "Управление пользователями",
        users: users,
        message,
      });
      // res.status(200).json(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async addUser(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // Проверка, существует ли пользователь с таким же email
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        req.session.message = "Пользователь с таким email уже существует.";
        res.redirect("/admin/users");
      }

      // Хеширование пароля перед сохранением в базу данных
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание нового пользователя
      const newUser = await db.User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      req.session.message = "Пользователь успешно добавлен.";
      res.redirect("/admin/users");

      // Отправка подтверждения об успешном создании пользователя
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
      res.status(500).send(error.message);
    }
  }

  // Управление пользователями (удаление)
  static async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const deleted = await db.User.destroy({
        where: { id },
      });
      if (deleted) {
        req.session.message = "Пользователь удален.";
        res.redirect("/admin/users");
      } else {
        req.session.message = "Пользователь не найден.";
        res.redirect("/admin/users");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getAllShows(req, res) {
    try {
      const shows = await db.Show.findAll({
        include: [{ model: db.Genre, as: "genre" }],
      });
      const genres = await db.Genre.findAll();

      const message = req.session.message;
      delete req.session.message;

      res.render("admin/shows", {
        title: "Управление представлениями",
        shows: shows,
        genres: genres,
        message,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // Добавление нового спектакля
  static async addShow(req, res) {
    try {
      const { title, genreId, description, showDate, ageLimit, price } =
        req.body;
      const imagePath = req.file ? req.file.path : null;

      const newShow = await db.Show.create({
        title,
        genreId,
        description,
        showDate,
        ageLimit,
        price,
        imagePath,
      });

      req.session.message = "Спектакль успешно добавлен";
      res.redirect("/admin/shows");
    } catch (error) {
      req.session.message = error.message;
      res.redirect("/admin/shows");
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
        req.session.message = "Спектакль удален.";
        res.redirect("/admin/shows");
      } else {
        req.session.message = "Спектакль не найден.";
        res.redirect("/admin/shows");
      }
    } catch (error) {
      req.session.message = error.message;
      res.redirect("/admin/shows");
    }
  }

  static async getEditShow(req, res) {
    try {
      const id = req.params.id; // Получаем ID спектакля из параметров запроса
      const show = await db.Show.findByPk(id, {
        include: [{ model: db.Genre, as: "genre" }],
      });

      if (!show) {
        req.session.message = "Спектакль не найден.";
        return res.redirect("/admin/shows");
      }

      const genres = await db.Genre.findAll();

      res.render("admin/edit/edit_shows", {
        title: "Редактирование спектакля",
        show: show,
        genres: genres,
        message: req.session.message,
      });
      delete req.session.message;
    } catch (error) {
      console.error("Ошибка при получении данных спектакля:", error);
      req.session.message = error.message;
      res.redirect("/admin/shows");
    }
  }

  // Обновление информации о спектакле
  static async updateShow(req, res) {
    try {
      const id = req.params.id;
      const { title, genreId, description, showDate, ageLimit, price } =
        req.body;
      const imagePath = req.file ? req.file.path.replace(/\\/g, "\\") : null;
      const updateData = {
        title,
        genreId,
        description,
        showDate,
        ageLimit,
        price,
      };

      if (imagePath) {
        updateData.imagePath = imagePath;
      }
      const updated = await db.Show.update(updateData, {
        where: { id },
      });
      if (updated[0] > 0) {
        const updatedShow = await db.Show.findByPk(id);

        req.session.message = "Спектакль успешно обновлен";
        res.redirect("/admin/shows");
      } else {
        req.session.message = "Спектакль не найден";
        res.redirect("/admin/shows");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await db.Order.findAll({
        include: [
          {
            model: db.User,
            attributes: ["id", "username"],
            as: "user",
          },
          {
            model: db.Ticket,
            as: "tickets",
            include: [
              {
                model: db.Show,
                as: "show",
                include: [
                  {
                    model: db.Genre,
                    as: "genre",
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.render("admin/orders", {
        title: "Управление заказами",
        orders: orders,
        message: req.session.message || "",
      });
      delete req.session.message;
    } catch (error) {
      console.error("Ошибка при получении списка заказов:", error);
      res.status(500).send(error.message);
    }
  }

  // Добавление нового заказа
  static async addOrder(req, res) {
    try {
      const newOrder = await db.Order.create(req.body);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  // Обновление заказа
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const updated = await db.Order.update(req.body, { where: { id } });
      if (updated[0] > 0) {
        res.status(200).send("Order updated successfully");
      } else {
        res.status(404).send("Order not found");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;
      await db.Order.update({ status }, { where: { id: orderId } });
      req.session.message = "Статус заказа обновлён.";
      res.redirect("/admin/orders");
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
      res.status(500).send(error.message);
    }
  }

  // Удаление заказа
  static async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;
      await db.Order.destroy({ where: { id: orderId } });
      req.session.message = "Заказ удалён.";
      res.redirect("/admin/orders");
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error);
      res.status(500).send(error.message);
    }
  }

  static async getAllGenres(req, res) {
    try {
      const genres = await db.Genre.findAll();

      const message = req.session.message;
      delete req.session.message;

      res.render("admin/genres", {
        title: "Управление жанрами",
        genres: genres,
        message,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // Добавление нового жанра
  static async addGenre(req, res) {
    try {
      const { name } = req.body;
      const existingGenre = await db.Genre.findOne({ where: { name } });
      if (existingGenre) {
        return res.status(409).send("Жанр с таким названием уже существует.");
      }

      const newGenre = await db.Genre.create({ name });
      req.session.message = "Жанр успешно добавлен";

      res.redirect("/admin/genres");
    } catch (error) {
      console.error("Ошибка при добавлении жанра:", error);
      res.status(500).send(error.message);
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
        req.session.message = "Жанр удален";

        res.redirect("/admin/genres");
      } else {
        req.session.message = "Жанр удален";

        res.redirect("/admin/genres");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = AdminController;
