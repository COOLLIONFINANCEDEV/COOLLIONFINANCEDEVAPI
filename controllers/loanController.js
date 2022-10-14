const LoanServices = require("../services/loanService.js");
const { check_body } = require("../utils/check_body.js");

const Service = new LoanServices(undefined, 'loan');

// Create
exports.create = (req, res) => {
    // Validate request
    if (!req.body || Object.keys(req.body).length == 0) {
        console.log(req.body);
        res.status(400).send({
            message: "Content can not be empty!"
        });

        return;
    }

    const result = check_body(req.body, {
        interest_rate: 'not_null',
        capital_limit: 'not_null',
        payment_frequency: 'not_null',
        term: 'not_null',
        late_payment: 'not_null'
    });

    if (Object.keys(result).length > 0)
        res.send(result);
    else {
        loadedModel = Service.loadModel({
            interest_rate: req.body.interest_rate,
            capital_limit: req.body.capital_limit,
            payment_frequency: req.body.payment_frequency,
            term: req.body.term,
            late_payment: req.body.late_payment,
        });


        // Save user in the database
        Service.create(loadedModel, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while saving."
                });
            else res.send(data);
        });
    }
};


// list
exports.findAll = (req, res) => {
    Service.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while geting."
            });
        else res.send(data);
    });
};


// Retrive
exports.findOne = (req, res) => {
    Service.getElement(req.params.id, (err, data) => {
        if (err) {
            res.status(500);

            if (err.kind == 'not_found') {
                res.status(404);
                err.message = "Not Found!";
            }

            res.send({
                message:
                    err.message || "Some error occurred while retriving."
            });
        }
        else res.send(data);
    });
};


// Update
exports.update = (req, res) => {
    if (!req.body || Object.keys(req.body).length == 0) {
        console.log(req.body);
        res.status(400).send({
            message: "Content can not be empty!"
        });

        return;
    }

    const result = check_body(req.body, {
        interest_rate: 'not_null',
        capital_limit: 'not_null',
        payment_frequency: 'not_null',
        term: 'not_null',
        late_payment: 'not_null'
    });

    if (Object.keys(result).length > 0)
        res.send(result);
    else {
        loadedModel = Service.loadModel({
            interest_rate: req.body.interest_rate,
            capital_limit: req.body.capital_limit,
            payment_frequency: req.body.payment_frequency,
            term: req.body.term,
            late_payment: req.body.late_payment,
        });
    }

    Service.update(req.params.id, loadedModel, (err, data) => {
        if (err) {
            res.status(500);

            if (err.kind == 'not_found') {
                res.status(404);
                err.message = "Not Found!";
            }

            if (err.code == "ER_DUP_ENTRY")
                res.status(200);

            res.send({
                message:
                    err.message || "Some error occurred while updating."
            });
        }
        else res.send(data);
    });
};


// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    Service.remove(req.params.id, (err, data) => {
        if (err) {
            res.status(500);

            if (err.kind == 'not_found') {
                res.status(404);
                err.message = "Not Found!";
            }

            res.send({
                message:
                    err.message || "Some error occurred while deleting."
            });
        }
        else res.send(data);
    });
};


// Delete all user
exports.deleteAll = (req, res) => {
    Service.purge((err, data) => {
        if (err) {
            res.status(500);

            if (err.kind == 'not_found') {
                res.status(404);
                err.message = "Not Found!";
            }

            res.send({
                message:
                    err.message || "Some error occurred while deleting."
            });
        }
        else res.send(data);
    });
};

