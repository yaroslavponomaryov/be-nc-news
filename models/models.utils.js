const db = require('../db/connection')

exports.checIdExists = (tableName, idColName, id) => {
return db
    .query (`
        SELECT * FROM ${tableName} 
        WHERE ${idColName} = $1;`, [id])
    .then(({ rows }) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Not found'});
        };
    });
};