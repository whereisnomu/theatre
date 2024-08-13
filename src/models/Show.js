// models/Show.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Show extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true, 
          },
        },
        genreId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            // Устанавливаем внешний ключ для жанра
            model: "Genres",
            key: "id",
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true, 
        },
        showDate: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true, 
          },
        },
        ageLimit: {
          type: DataTypes.INTEGER,
          allowNull: true, 
        },

        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: true, 
            min: 0, 
          },
        },

        imagePath: {
          type: DataTypes.STRING,
          allowNull: true, 
        },
      },
      {
        sequelize,
        modelName: "Show",
      }
    );
  }
}

module.exports = Show;
