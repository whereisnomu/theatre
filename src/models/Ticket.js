const { Model, DataTypes } = require("sequelize");

class Ticket extends Model {
  static init(sequelize) {
    super.init(
      {
        showId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Shows", 
            key: "id",
          },
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "Orders",
            key: "id",
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          // Позволяем быть null, если пользователь не авторизован (для случаев добавления в корзину без регистрации)
          allowNull: true, 
          references: {
            model: "Users", 
            key: "id",
          },
        },
        seatNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isReserved: {
          type: DataTypes.VIRTUAL, // Виртуальное поле для проверки, зарезервирован ли билет (привязан к заказу)
          get() {
            return !!this.orderId; // Возвращает true, если есть orderId
          },
        },
      },
      {
        sequelize,
        modelName: "Ticket",
      }
    );
  }
}

module.exports = Ticket;
