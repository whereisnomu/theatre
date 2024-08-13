
const db = require("../models"); 

class TicketController {
  // Создание нового билета
  static async createTicket(req, res) {
    try {
      const { showId, seatNumber } = req.body;
      if (!showId || !seatNumber) {
        return res
          .status(400)
          .json({ message: "Необходимо указать showId и seatNumber" });
      }

      const newTicket = await db.Ticket.create({
        showId,
        seatNumber,
        orderId: null, // Предполагаем, что билет пока не привязан к заказу
      });

      res.status(201).json(newTicket);
    } catch (error) {
      console.error("Ошибка при создании билета:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Получение списка всех билетов
  static async getAllTickets(req, res) {
    try {
      const tickets = await db.Ticket.findAll({
        include: [db.Show, db.Order], // Добавляем информацию о спектакле и заказе
      });
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Ошибка при получении списка билетов:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Получение билета по ID
  static async getTicketById(req, res) {
    try {
      const ticket = await db.Ticket.findByPk(req.params.id, {
        include: [db.Show, db.Order], 
      });
      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).send("Билет не найден");
      }
    } catch (error) {
      console.error("Ошибка при получении билета:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Обновление билета
  static async updateTicket(req, res) {
    try {
      const { showId, orderId, seatNumber } = req.body;
      const [updated] = await db.Ticket.update(
        {
          showId,
          orderId,
          seatNumber,
        },
        {
          where: { id: req.params.id },
        }
      );
      if (updated) {
        const updatedTicket = await db.Ticket.findByPk(req.params.id, {
          include: [db.Show, db.Order],
        });
        res.status(200).json(updatedTicket);
      } else {
        res.status(404).send("Билет не найден");
      }
    } catch (error) {
      console.error("Ошибка при обновлении билета:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление билета
  static async deleteTicket(req, res) {
    try {
      const id = req.params.id;
      const deleted = await db.Ticket.destroy({
        where: { id },
      });
      if (deleted) {
        res.status(200).send("Билет удален");
      } else {
        res.status(404).send("Билет не найден");
      }
    } catch (error) {
      console.error("Ошибка при удалении билета:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TicketController;
