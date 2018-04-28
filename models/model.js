var db = require('../config/db');

module.exports = {
    query: query
}

function query(sqlQuery){
    return db.query(sqlQuery);
}
