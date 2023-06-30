const { 
    fetchArticleById, 
    fetchAllArticles, 
    patchArticleVote 
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;

    return fetchArticleById(article_id)
        .then((article)=> {
            res.status(200).send({ article })
        })
        .catch(next)
};

exports.getAllArticles = (req, res, next) => {
    return fetchAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
};

exports.updateArticleVote = (req, res, next) => {
    const { article_id } = req.params;
    const reqBody = req.body;
    return patchArticleVote(article_id, reqBody)
        .then((updatedArticle) => {
            res.status(200).send({ updatedArticle })
        })
        .catch(next)
};