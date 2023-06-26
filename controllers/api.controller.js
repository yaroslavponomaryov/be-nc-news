const { fetchAllEndpoints } = require('../models/api.model')

exports.getAllEndpoints = (req, res, next) => {
    return fetchAllEndpoints()
    .then((endpoints) => {
        res.status(200).send({ endpoints })

    });


}