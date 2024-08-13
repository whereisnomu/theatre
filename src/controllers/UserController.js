// controllers/UserController.js

const db = require("../models");

class UserController {
  // Создание нового пользователя
  static async createUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const newUser = await db.User.create({
        username,
        email,
        password,
        role,
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Получение списка всех пользователей
  static async getAllUsers(req, res) {
    try {
      const users = await db.User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Ошибка при получении списка пользователей:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Получение пользователя по ID
  static async getUserById(req, res) {
    try {
      const user = await db.User.findByPk(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("Пользователь не найден");
      }
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Обновление данных пользователя
  static async updateUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const [updated] = await db.User.update(
        { username, email, password, role },
        {
          where: { id: req.params.id },
        }
      );
      if (updated) {
        const updatedUser = await db.User.findByPk(req.params.id);
        res.status(200).json(updatedUser);
      } else {
        res.status(404).send("Пользователь не найден");
      }
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление пользователя
  static async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const deleted = await db.User.destroy({
        where: { id },
      });
      if (deleted) {
        res.status(200).send("Пользователь удален");
      } else {
        res.status(404).send("Пользователь не найден");
      }
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async addTicketToCart(req, res) {
    try {
      const { userId, showId, seatNumber } = req.body;

      // Проверка на наличие билета с таким же showId и seatNumber, который еще не заказан (orderId is null)
      const existingTicket = await db.Ticket.findOne({
        where: {
          showId: showId,
          seatNumber: seatNumber,
          orderId: null, // Проверяем только билеты в корзине
        },
      });

      // Если билет на это место уже существует в корзине
      if (existingTicket) {
        req.session.message = "Место уже занято.";
        res.redirect("/");
      } else {
        // Если место свободно, создаем новый билет
        const newTicket = await db.Ticket.create({
          showId,
          orderId: null,
          seatNumber,
          userId,
        });

        req.session.message = "Билет добавлен в корзину";
        res.redirect(`/users/${userId}/cart`);
      }
    } catch (error) {
      console.error("Ошибка при добавлении билета в корзину:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Просмотр корзины пользователя
  static async viewCart(req, res) {
    try {
      const userId = req.params.userId; // ID пользователя берется из параметров запроса
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).send("Пользователь не найден");
      }

      // Выбор билетов, которые находятся в корзине
      const ticketsInCart = await db.Ticket.findAll({
        where: {
          userId: userId,
          orderId: null,
        },
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
      });

      const message = req.session.message;
      delete req.session.message;

      res.render("users/cart", { user: user, tickets: ticketsInCart, message });
    } catch (error) {
      console.error("Ошибка при получении корзины пользователя:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление билета из корзины
  static async removeTicketFromCart(req, res) {
    try {
      const { ticketId } = req.params;
      const ticket = await db.Ticket.findOne({
        where: {
          id: ticketId,
          orderId: null, // Убедимся, что билет находится в корзине, а не в заказе
        },
      });

      if (!ticket) {
        return res.status(404).send("Билет не найден в корзине.");
      }

      await ticket.destroy();
      req.session.message = "Билет удален из корзины.";
      res.redirect(`/users/${req.user.id}/cart`);
    } catch (error) {
      console.error("Ошибка при удалении билета из корзины:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async checkoutCart(req, res) {
    try {
      const userId = req.params.userId;

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).send("Пользователь не найден.");
      }

      // Получение всех билетов в корзине, которые ещё не привязаны к заказу
      const ticketsInCart = await db.Ticket.findAll({
        where: {
          userId: userId,
          orderId: null,
        },
        include: [
          {
            model: db.Show,
            as: "show",
          },
        ],
      });

      // Расчёт общей стоимости билетов
      const total = ticketsInCart.reduce(
        (acc, ticket) => acc + parseFloat(ticket.show.price),
        0
      );

      if (total > 0) {
        // Создание нового заказа
        const newOrder = await db.Order.create({
          userId,
          total: total.toFixed(2),
          status: "new",
        });

        // Привязка билетов к заказу
        await Promise.all(
          ticketsInCart.map((ticket) => ticket.update({ orderId: newOrder.id }))
        );

        req.session.message = "Заказ успешно оформлен";

        res.redirect(`/users/${userId}/cart`);
      } else {
        res.status(400).send("Корзина пуста");
      }
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      res.status(500).send("Ошибка сервера при оформлении заказа");
    }
  }
}

module.exports = UserController;
