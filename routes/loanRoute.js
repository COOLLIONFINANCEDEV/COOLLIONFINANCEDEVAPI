const controller = require("../controllers/loanController.js");

var router = require("express").Router();

// Create a new user
router.post("/create", controller.create);

// List users
router.get("/list", controller.findAll);

// Retrieve user
router.get("/retrive/:id", controller.findOne);

// Update a user
router.put("/update/:id", controller.update);

// Delete a user
router.delete("/delete/:id", controller.delete);

// Purge users
router.delete("/purge", controller.deleteAll);

module.exports = router;