const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Genre extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        sequelize,
        modelName: "Genre",
      }
    );
  }
}

module.exports = Genre;
