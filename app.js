const express = require('express');
const app = express();
const { 
    handleServerErrors, 
    handlePsqlErrors,
    handleCustomErrors
} = require('./errors/errors');
const { getAllTopics } = require('./controllers/topics.controller');
const { getAllEndpoints } = require('./controllers/api.controller');
const { 
    getCommentsByArticleId, 
    addCommentByArticleId 
} = require('./controllers/comments.controller');
const { 
    getArticleById, 
    getAllArticles, 
    updateArticleVote
} = require('./controllers/articles.controller.js');

app.use(express.json());


app.get('/api/', getAllEndpoints)

app.get('/api/topics', getAllTopics);

app.get('/api/articles/', getAllArticles);

app.route('/api/articles/:article_id')
    .get(getArticleById)
    .patch(updateArticleVote);

app.route('/api/articles/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(addCommentByArticleId);

app.all('*', (_, res) => {
    res.status(404).send({status: 404, msg: 'Not found'})
});

app.use(handlePsqlErrors)

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = { app }