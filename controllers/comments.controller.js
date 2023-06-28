const { fetchArticleComments } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleComments(article_id)
        .then((comments) => {
            res.status(200).send({comments})
        });
};