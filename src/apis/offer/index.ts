// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/offer/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication from 'src/middlewares/authentication';

const offerEndpoint = endpoints.offer;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new offer
router.post(resolve_route(offerEndpoint.create), authentication, controller.create);

// // List offer
router.get(resolve_route(offerEndpoint.list), authentication, controller.findAll);

// Retrieve offer
router.get(resolve_route(offerEndpoint.retrive), authentication, controller.findOne);

// // Update a offer
router.put(resolve_route(offerEndpoint.update), authentication, controller.update);

// // Delete a offer
router.delete(resolve_route(offerEndpoint.delete), authentication, controller.remove);

// // Purge offer
router.delete(resolve_route(offerEndpoint.purge), authentication, controller.removeAll);

export default router;

