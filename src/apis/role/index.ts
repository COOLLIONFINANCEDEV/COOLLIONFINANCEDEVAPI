// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/role/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication from 'src/middlewares/authentication';

const roleEndpoint = endpoints.role;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new role
router.post(resolve_route(roleEndpoint.create), authentication, controller.create);

// // List roles
router.get(resolve_route(roleEndpoint.list), authentication, controller.findAll);

// Retrieve role
router.get(resolve_route(roleEndpoint.retrive), authentication, controller.findOne);

// // Update a role
router.put(resolve_route(roleEndpoint.update), authentication, controller.update);

// // Delete a role
router.delete(resolve_route(roleEndpoint.delete), authentication, controller.remove);

// // Purge roles
router.delete(resolve_route(roleEndpoint.purge), authentication, controller.removeAll);

export default router;

