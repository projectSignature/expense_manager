const Sequelize = require('sequelize');
/* const sequelize = new Sequelize('defaultdb', 'doadmin', 'AVNS_HzTD1mdcLG5r73POOIr', {
    dialect: 'mysql',
    host: 'db-mysql-nyc1-46829-do-user-12541529-0.b.db.ondigitalocean.com',
    port: 25060
}); */
const sequelize = new Sequelize('kaikei_db', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3307
});

module.exports = sequelize;

