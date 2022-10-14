const Hasher = require("../utils/hasher.js");
const UserServices = require("../services/userService.js");
const { check_body } = require("../utils/check_body.js");

const Service = new UserServices(undefined, 'user');

// Create and Save a new user
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
        first_name: 'not_null',
        last_name: 'not_null',
        email: 'not_null, is_email',
        password: 'not_null, min_length=8, max_length=20'
    });

    if (Object.keys(result).length > 0)
        res.send(result);
    else {
        const password = Hasher.hash(req.body.password)
        loadedModel = Service.loadModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            password: password.hash,
            salt: password.salt
        });

        console.log(loadedModel);

        // Save user in the database
        Service.create(loadedModel, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while saving the user."
                });
            else res.send(data);
        });
    }
};


// Retrieve all user from the database (with condition).
exports.findAll = (req, res) => {
    Service.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while geting the users."
            });
        else res.send(data);
    });
};


// Retrive user
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
                    err.message || "Some error occurred while retriving the user."
            });
        }
        else res.send(data);
    });
};


// Update user
exports.update = (req, res) => {
    if (!req.body || Object.keys(req.body).length == 0) {
        console.log(req.body);
        res.status(400).send({
            message: "Content can not be empty!"
        });

        return;
    }

    const result = check_body(req.body, {
        first_name: 'not_null',
        last_name: 'not_null',
        email: 'not_null, is_email',
        password: 'not_null, min_length=8, max_length=20'
    });

    if (Object.keys(result).length > 0)
        res.send(result);
    else {
        const password = Hasher.hash(req.body.password)
        loadedModel = Service.loadModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            password: password.hash,
            salt: password.salt
        })
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
                    err.message || "Some error occurred while updating the user."
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
                    err.message || "Some error occurred while deleting the user."
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
                    err.message || "Some error occurred while deleting the user."
            });
        }
        else res.send(data);
    });
};

