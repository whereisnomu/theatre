// models/Order.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Users", 
            key: "id",
          },
        },
        total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: true, // Проверяем, что это десятичное число
            min: 0, 
          },
        },
        status: {
          type: DataTypes.ENUM("new", "paid", "cancelled"),
          defaultValue: "new",
          validate: {
            isIn: [["new", "paid", "cancelled"]], 
          },
        },
        orderDate: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW, 
        },
      },
      {
        sequelize,
        modelName: "Order",
      }
    );
  }
}

module.exports = Order;
