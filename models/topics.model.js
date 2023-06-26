const db = require('../db/connection');


exports.fetchAllTopics = () => {

    const query = `
        SELECT * FROM topics;
    `
    return db.query(query)
    .then(({ rows }) => {
        return rows;
        
    })


};