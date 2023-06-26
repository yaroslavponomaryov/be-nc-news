const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controller');

app.get('/api/topics', getAllTopics);


module.exports = { app }