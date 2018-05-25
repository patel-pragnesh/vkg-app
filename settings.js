module.exports = {
  db: {
    user: 'horcsa',
    password: 'csacsa',
    server: '127.0.0.1',
    //port: 1433,
    database: 'vizkeszlet_gazdalkodas',
    connectionTimeout: 10000,
    requestTimeout: 10000,
    options:{
      instanceName: 'sqlexpress',
      encrypt:false
    }
  },
  port: 3000 
  //env: 'development',

  // Environment-dependent settings
  // development: {
  //   db: {
  //     user: 'horcsa',
  //     password: 'csacsa',
  //     server: '127.0.0.1',
  //     //port: 1433,
  //     database: 'vizkeszlet_gazdalkodas',
  //     connectionTimeout: 10000,
  //     requestTimeout: 10000,
  //     options:{
  //       instanceName: 'sqlexpress',
  //       encrypt:false
  //     }
  //   }
  // },
  // production: {
  //   db: {
  //     dialect: 'sqlite',
  //     storage: 'db/database.sqlite'
  //   }
  // }
};