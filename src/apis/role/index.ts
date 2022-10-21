// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/role/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const roleEndpoint = endpoints.role;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new role
router.post(resolve_route(roleEndpoint.create), controller.create);

// // List roles
router.get(resolve_route(roleEndpoint.list), controller.findAll);

// Retrieve role
router.get(resolve_route(roleEndpoint.retrive), controller.findOne);

// // Update a role
router.put(resolve_route(roleEndpoint.update), controller.update);

// // Delete a role
router.delete(resolve_route(roleEndpoint.delete), controller.remove);

// // Purge roles
router.delete(resolve_route(roleEndpoint.purge), controller.removeAll);

export default router;

