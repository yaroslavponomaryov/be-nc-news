const { fetchArticleById } = require("../models/articles.model");
const { checkIdExists } = require("../models/id.model");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const promises = [fetchArticleById(article_id), checkIdExists(article_id)]

    return Promise.all(promises)
        .then((resolvedPromises)=> {
            const article = resolvedPromises[0]
            res.status(200).send({article})
        })
        .catch(next)
};