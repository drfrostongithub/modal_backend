'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env]['api-dbName'];

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], Object.assign({}, config, {
        pool: {
            max: 5,
            idle: 30000,
            acquire: 60000,
        }
    }));
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, Object.assign({}, config, {
        pool: {
            max: 5,
            idle: 30000,
            acquire: 60000,
        }
    }));
}
// ex: user.js
db.User = require(path.join(__dirname, '/user'))(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync()
    .then(result => {
        console.log('[MYSQL] database connected ');
    })
    .catch(err => {
        console.log('[MYSQL] connection database failed...' + err);
    });
module.exports = db;
