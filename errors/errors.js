exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Something is wrong with a server"});
};