exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Something is wrong with a server"});
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({status: 400, msg: 'Bad request'});
    } else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send(err);
    } else next(err)
};