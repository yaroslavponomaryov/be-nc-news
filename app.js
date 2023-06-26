const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controller');
const { handleServerErrors } = require('./errors/errors');
const { getAllEndpoints } = require('./controllers/api.controller');

app.get('/api/topics', getAllTopics);

app.get('/api/', getAllEndpoints)

app.use(handleServerErrors);


module.exports = { app }