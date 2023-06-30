const { 
    fetchArticleById, 
    fetchAllArticles, 
    patchArticleVote 
} = require("../models/articles.model");
const { 
    checIdExists, 
    checkTopicExists
 } = require("../models/models.utils");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return fetchArticleById(article_id)
        .then((article)=> {
            res.status(200).send({ article })
        })
        .catch(next)
};

exports.getAllArticles = (req, res, next) => {
    const { topic } = req.query;
    const { sort_by } = req.query;
    const { order } = req.query;
    const promises = [fetchAllArticles(topic, sort_by, order)];
    if(topic) {
        promises.push(checkTopicExists(topic));
    }
    Promise.all(promises)
        .then((resolvedPromises)=> {
            const articles = resolvedPromises[0];
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.updateArticleVote = (req, res, next) => {
    const { article_id } = req.params;
    const reqBody = req.body;
    const promises = [patchArticleVote(article_id, reqBody), checIdExists('articles', 'article_id', article_id)]
    Promise.all(promises)
        .then((resolvedPromises) => {
            const updatedArticle = resolvedPromises[0];
            res.status(200).send({ updatedArticle });
        })
        .catch(next);
};