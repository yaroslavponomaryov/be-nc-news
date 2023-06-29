const db = require('../db/connection');

exports.fetchArticleComments = (id) => {
    const commentsQuery = `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `
    return db.query(commentsQuery, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({status: 404, msg: 'Not found'});
            } else {
                return rows;
            };
        });
};

exports.insertCommentByArticleId = (id, bodyObject) => {

    const queryValues = [];
    const body = bodyObject.body;
    queryValues.push(body);
    const article_id = Number(id);
    queryValues.push(article_id);
    const author = bodyObject.username;
    queryValues.push(author);
    const created_at = new Date().toLocaleString();
    queryValues.push(created_at);

    const queryStr = `
        INSERT INTO comments 
            (body, article_id, author, created_at) 
        VALUES
            ($1, $2, $3, $4) 
        RETURNING *;
    `
    return db.query(queryStr, queryValues)
        .then(({ rows }) => {
            return rows[0];
        })
};