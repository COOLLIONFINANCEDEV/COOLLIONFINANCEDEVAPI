// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/users/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication, { right_user } from 'src/middlewares/authentication';

const userEndpoint = endpoints.users;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new user
// router.post(resolve_route(userEndpoint.create), controller.create);

// // List users
router.get(resolve_route(userEndpoint.list), authentication, controller.findAll);

// Retrieve user
router.get(resolve_route(userEndpoint.retrive), authentication, right_user, controller.findOne);

// // Update a user
router.put(resolve_route(userEndpoint.update), authentication, right_user, controller.update);

// // Delete a user
router.delete(resolve_route(userEndpoint.delete), authentication, right_user, controller.remove);

// // Purge users
router.delete(resolve_route(userEndpoint.purge), authentication, controller.removeAll);

export default router;

