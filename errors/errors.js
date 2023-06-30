exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Something is wrong with a server"});
};

exports.handlePsqlErrors = (err, req, res, next) => {
    const sql400 = ['22P02', '23502']
    const sql404 = ['23503']
    if (err.code) {
        if (sql400.includes(err.code)) {
            res.status(400).send({status: 400, msg: 'Bad request'});
        } else if (sql404.includes(err.code)) {
            res.status(404).send({status: 404, msg: 'Not found'});
        };
    } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send(err);
    } else next(err)
};