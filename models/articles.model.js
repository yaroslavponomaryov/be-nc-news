const db = require('../db/connection');

exports.fetchArticleById = (articleId) => {

    const query = `
    SELECT * FROM articles
    WHERE article_id = $1;
    `
    return db.query(query, [articleId])
    .then(({ rows }) => {
        return rows[0];
    })
}