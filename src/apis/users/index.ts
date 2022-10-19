// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/users/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const userEndpoint = endpoints.users;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new user
router.post(resolve_route(userEndpoint.create), controller.create);

// // List users
router.get(resolve_route(userEndpoint.list), controller.findAll);

// Retrieve user
router.get(resolve_route(userEndpoint.retrive), controller.findOne);

// // Update a user
router.put(resolve_route(userEndpoint.update), controller.update);

// // Delete a user
router.delete(resolve_route(userEndpoint.delete), controller.remove);

// // Purge users
router.delete(resolve_route(userEndpoint.purge), controller.removeAll);

export default router;

