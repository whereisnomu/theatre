const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

const User = require("./User");
const Genre = require("./Genre");
const Show = require("./Show");
const Order = require("./Order");
const Ticket = require("./Ticket");

User.init(sequelize, Sequelize);
Genre.init(sequelize, Sequelize);
Show.init(sequelize, Sequelize);
Order.init(sequelize, Sequelize);
Ticket.init(sequelize, Sequelize);

db.User = User;
db.Genre = Genre;
db.Show = Show;
db.Order = Order;
db.Ticket = Ticket;

db.Genre.hasMany(db.Show, { foreignKey: "genreId", onDelete: "CASCADE" });
db.Show.belongsTo(db.Genre, { foreignKey: "genreId", as: "genre" });

db.User.hasMany(db.Order, { foreignKey: "userId", onDelete: "CASCADE" });
db.Order.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Order.hasMany(db.Ticket, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  as: "tickets",
});
db.Ticket.belongsTo(db.Order, { foreignKey: "orderId", as: "order" });

db.Show.hasMany(db.Ticket, { foreignKey: "showId", onDelete: "CASCADE" });
db.Ticket.belongsTo(db.Show, { foreignKey: "showId", as: "show" });

module.exports = db;
