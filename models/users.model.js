const db = require('../db/connection');

exports.fetchAllUsers = () => {
    const queryToUsers = `
        SELECT username, name, avatar_url FROM users;
    `
    return db.query(queryToUsers)
        .then(({ rows }) => {
            return rows;
        });
};