// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/company/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication, { right_owner, right_user } from 'src/middlewares/authentication';
import basic_tenant_manager from 'src/middlewares/basic_tenant_manager';

const companyEndpoint = endpoints.company;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new company
router.post(resolve_route(companyEndpoint.create), authentication, /*basic_tenant_manager({ authaurizedTenant: ["admin", "master"] }),*/ controller.create);

// // List company
router.get(resolve_route(companyEndpoint.list), authentication, /*basic_tenant_manager({ authaurizedTenant: ["admin", "master"] }),*/ controller.findAll);

// Retrieve company
router.get(resolve_route(companyEndpoint.retrive), authentication, /*basic_tenant_manager({ permission: "read__users" }), right_owner({ entity: "company", constraint: "manager_id" }),*/ controller.findOne);

// Retrieve companies by manager
router.get(resolve_route(companyEndpoint.retriveByUser), authentication, /*basic_tenant_manager({ authaurizedTenant: ["admin", "master"], permission: "read__users" }),*/ right_user, controller.findByUser);

// // Update a company
router.put(resolve_route(companyEndpoint.update), authentication, right_owner({ entity: "company", constraint: "manager_id" }), controller.update);

// // Delete a company
router.delete(resolve_route(companyEndpoint.delete), authentication, right_owner({ entity: "company", constraint: "manager_id" }), controller.remove);

// // Purge company
router.delete(resolve_route(companyEndpoint.purge), authentication, controller.removeAll);

export default router;

