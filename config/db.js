var config = require('./config');
var mysql2 = require('mysql2');
var db = require('mysql-promise')();

db.configure(config.mysql, require('mysql2'));

module.exports = db;