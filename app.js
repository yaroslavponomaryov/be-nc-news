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
    getArticleById, 
    getAllArticles 
} = require('./controllers/articles.controller.js');

app.get('/api/topics', getAllTopics);

app.get('/api/', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/', getAllArticles);

app.all('*', (_, res) => {
    res.status(404).send({status: 404, msg: 'Not found'})
});

app.use(handlePsqlErrors)

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = { app }