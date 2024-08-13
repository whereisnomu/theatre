const { Sequelize } = require("sequelize");
const config = require("./config");

const env = process.env.NODE_ENV || "development";
const { username, password, database, host, port, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  dialectOptions: config[env].dialectOptions, 
});
console.log(process.env.NODE_ENV);
// console.log(sequelize);

module.exports = sequelize;
