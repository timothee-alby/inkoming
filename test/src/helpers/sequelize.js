const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.PGRST_DB_URI, {
  logging: false
})

module.exports = sequelize
