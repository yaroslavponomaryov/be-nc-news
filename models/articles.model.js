const db = require('../db/connection');
const { checIdExists } = require('./models.utils');

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

exports.fetchAllArticles = (topic, sort_by='created_at', order='desc') => {

    const greenList = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'desc', 'asc'];

    if (!greenList.includes(sort_by) || !greenList.includes(order)) {
        return Promise.reject({status: 400, msg: 'Bad request'});
    }

    const queryValues = [];
    
    let queryToArticles = `
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
    `
    if (topic) {
        queryValues.push(topic)
        queryToArticles+=`
        WHERE topic = $1  
        `
    };

    queryToArticles+= `
        GROUP BY articles.article_id 
        ORDER BY ${sort_by} ${order};
    `
    return db
        .query(queryToArticles, queryValues)
        .then(({rows})=> {
            return rows;
        });
};

exports.patchArticleVote = (id, voteObj) => {
    const queryValues = [voteObj.inc_votes, id];
    const queryToArticles = `
        UPDATE articles SET votes = articles.votes + $1 
        WHERE article_id = $2 
        RETURNING *;
    `
    return db.query(queryToArticles, queryValues)
        .then(({ rows }) => {
            return rows[0];
        });
};