const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controller');
const { handleServerErrors } = require('./errors/errors');

app.get('/api/topics', getAllTopics);

app.use(handleServerErrors);


module.exports = { app }