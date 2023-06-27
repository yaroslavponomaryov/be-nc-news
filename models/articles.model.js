const db = require('../db/connection');
const { arrangeCommentsAndArticles } = require('./utils');

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
    const queryToComments = `
        SELECT article_id, comment_id FROM comments; 
    `
    
    const articlesQuery = `
    SELECT article_id FROM articles;
    `

    const promises = [db.query(queryToComments), db.query(articlesQuery)]

    return Promise.all(promises)
        .then((resolvedPromises) => {
            const articlesAndComments = resolvedPromises[0].rows;
            const allArticles = resolvedPromises[1].rows;
            return arrangeCommentsAndArticles(articlesAndComments, allArticles)
        })
        .then((arrangedArticlesAndComments) => {
            
            const queryToArticles = `
                SELECT 
                    article_id, 
                    title,
                    topic,
                    author,
                    created_at,
                    votes,
                    article_img_url
                FROM articles
                ORDER BY created_at DESC;
            `
            return db
                .query(queryToArticles)
                .then(({rows})=> {
                    rows.forEach((article) => {
                        article.comment_count = 0
                        if(arrangedArticlesAndComments.hasOwnProperty(article.article_id)) {
                            article.comment_count += arrangedArticlesAndComments[article.article_id]
                        }
                    })
                    return rows;
                });
        });
};