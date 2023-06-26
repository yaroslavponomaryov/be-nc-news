const { fetchAllTopics } = require('../models/topics.model')

exports.getAllTopics = (req, res) => {

    return fetchAllTopics()
        .then((topics) => {
            res.status(200).send({topics});
        })



}