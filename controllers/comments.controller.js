const { fetchArticleComments, insertCommentByArticleId, removeComment } = require("../models/comments.model");
const { checIdExists } = require("../models/models.utils");

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

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    const promises = [removeComment(comment_id), checIdExists('comments', 'comment_id', comment_id)]

    Promise.all(promises)
        .then(() => {
            res.status(204).send();
        })
        .catch(next)
};