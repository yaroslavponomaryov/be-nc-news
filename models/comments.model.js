const db = require('../db/connection');

exports.fetchArticleComments = (id) => {
    const commentsQuery = `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `
    return db.query(commentsQuery, [id])
        .then(({ rows }) => {
            return rows
        });
};