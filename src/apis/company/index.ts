// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/company/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const companyEndpoint = endpoints.company;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new company
router.post(resolve_route(companyEndpoint.create), controller.create);

// // List company
router.get(resolve_route(companyEndpoint.list), controller.findAll);

// Retrieve company
router.get(resolve_route(companyEndpoint.retrive), controller.findOne);

// // Update a company
router.put(resolve_route(companyEndpoint.update), controller.update);

// // Delete a company
router.delete(resolve_route(companyEndpoint.delete), controller.remove);

// // Purge company
router.delete(resolve_route(companyEndpoint.purge), controller.removeAll);

export default router;

