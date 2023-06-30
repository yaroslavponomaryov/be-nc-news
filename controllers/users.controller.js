const { fetchAllUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
    return fetchAllUsers()
        .then((users) => {
            res.status(200).send({ users });
        });
};