let Sequelize = require('sequelize');
let Op = Sequelize.Op;

module.exports = {
  port: 3000,
  env: 'development',

  // Environment-dependent settings
  development: {
    db: {
      database:'vizkeszlet_gazdalkodas',
      user: 'horcsa',
      password: 'csacsa',
      host: 'localhost',
      dialect: 'mssql',
      pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions:{
        instanceName: 'SQLEXPRESS',    
      },
      operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
      },
    }
  },
  production: {
    db: {
      dialect: 'sqlite',
      storage: 'db/database.sqlite'
    }
  }
};