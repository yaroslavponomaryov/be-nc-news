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

exports.fetchAllArticles = () => {

    const queryToArticles = `
        SELECT 
            articles.article_id, 
            articles.author, 
            articles.title, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
        COUNT(comments.comment_id) AS comment_count 
        FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id 
        GROUP BY articles.article_id
        ORDER BY created_at DESC;
    `
        return db
            .query(queryToArticles)
            .then(({rows})=> {
                    return rows;
            });
};