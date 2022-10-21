// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/permissions/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const permissionsEndpoint = endpoints.permissions;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new permissions
router.post(resolve_route(permissionsEndpoint.create), controller.create);

// // List roles
router.get(resolve_route(permissionsEndpoint.list), controller.findAll);

// Retrieve permissions
router.get(resolve_route(permissionsEndpoint.retrive), controller.findOne);

// // Update a permissions
router.put(resolve_route(permissionsEndpoint.update), controller.update);

// // Delete a permissions
router.delete(resolve_route(permissionsEndpoint.delete), controller.remove);

// // Purge roles
router.delete(resolve_route(permissionsEndpoint.purge), controller.removeAll);

export default router;

