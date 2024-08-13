const db = require("../models");

class OrderController {
  // Создание нового заказа
  static async createOrder(req, res) {
    try {
      const { userId, total, status } = req.body;
      const newOrder = await db.Order.create({
        userId,
        total,
        status,
      });
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Получение списка всех заказов
  static async getAllOrders(req, res) {
    try {
      const orders = await db.Order.findAll({
        include: [db.User, db.Ticket], // Добавляем информацию о пользователе и билетах
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Ошибка при получении списка заказов:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Получение заказа по ID
  static async getOrderById(req, res) {
    try {
      const order = await db.Order.findByPk(req.params.id, {
        include: [db.User, db.Ticket], // Добавляем информацию о пользователе и билетах
      });
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).send("Заказ не найден");
      }
    } catch (error) {
      console.error("Ошибка при получении заказа:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Обновление заказа
  static async updateOrder(req, res) {
    try {
      const { total, status } = req.body;
      const [updated] = await db.Order.update(
        { total, status },
        {
          where: { id: req.params.id },
        }
      );
      if (updated) {
        const updatedOrder = await db.Order.findByPk(req.params.id, {
          include: [db.User, db.Ticket],
        });
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).send("Заказ не найден");
      }
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление заказа
  static async deleteOrder(req, res) {
    try {
      const id = req.params.id;
      const deleted = await db.Order.destroy({
        where: { id },
      });
      if (deleted) {
        res.status(200).send("Заказ удален");
      } else {
        res.status(404).send("Заказ не найден");
      }
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
