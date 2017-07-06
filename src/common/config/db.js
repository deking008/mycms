'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      host: '127.0.0.1',
      port: '3306',
      database: 'cms',
      user: 'root',
      password: '123456',
      prefix: 'cmswing_',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};