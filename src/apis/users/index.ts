// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/users/controller'
import { NextFunction, Request, Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication, { right_owner, right_user } from 'src/middlewares/authentication';
import basic_tenant_manager from 'src/middlewares/basic_tenant_manager';

const userEndpoint = endpoints.users;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new user
// router.post(resolve_route(userEndpoint.create), controller.create);

// // List users
router.get(resolve_route(userEndpoint.list), authentication, basic_tenant_manager({ authaurizedTenant: ["admin", "master"] }), controller.findAll);

// Retrieve user
router.get(resolve_route(userEndpoint.retrive), authentication, basic_tenant_manager({ authaurizedTenant: ["admin", "master"], permission: "read__users" }), right_user, controller.findOne);

// // Update a user
router.put(resolve_route(userEndpoint.update), authentication, basic_tenant_manager({ permission: "read__users" }), right_user, right_owner, controller.update);

// // Delete a user
router.delete(resolve_route(userEndpoint.delete), authentication, basic_tenant_manager({ permission: "read__users" }), right_user, right_owner, controller.remove);

// // Purge users
router.delete(resolve_route(userEndpoint.purge), authentication, basic_tenant_manager({ authaurizedTenant: ["admin", "master"] }), controller.removeAll);

export default router;

