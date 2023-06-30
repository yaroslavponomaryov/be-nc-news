const { fetchArticleComments, insertCommentByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleComments(article_id)
        .then((comments) => {
            res.status(200).send({comments})
        })
        .catch(next)
};

exports.addCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const bodyObject = req.body;
    return insertCommentByArticleId(article_id, bodyObject)
        .then((postedComment) => {
            res.status(201).send({ postedComment });
        })
        .catch(next)

};