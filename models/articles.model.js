const db = require('../db/connection');

exports.fetchArticleById = (articleId) => {
    const query = `
    SELECT * FROM articles
    WHERE article_id = $1;
    `
    return db.query(query, [articleId])
    .then(({ rows }) => {
        if (!rows.length) return Promise.reject({status: 404, msg: 'Not found'})
        else return rows[0];
    });
};