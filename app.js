const express = require('express');
const app = express();
const { handleServerErrors } = require('./errors/errors');
const { getAllTopics } = require('./controllers/topics.controller');
const { getAllEndpoints } = require('./controllers/api.controller');
const { getArticleById } = require('./controllers/articles.controller.js');

app.get('/api/topics', getAllTopics);

app.get('/api/', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById);

app.use(handleServerErrors);


module.exports = { app }