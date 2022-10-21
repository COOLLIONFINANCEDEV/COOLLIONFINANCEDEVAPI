// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/offer/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const offerEndpoint = endpoints.offer;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new offer
router.post(resolve_route(offerEndpoint.create), controller.create);

// // List offer
router.get(resolve_route(offerEndpoint.list), controller.findAll);

// Retrieve offer
router.get(resolve_route(offerEndpoint.retrive), controller.findOne);

// // Update a offer
router.put(resolve_route(offerEndpoint.update), controller.update);

// // Delete a offer
router.delete(resolve_route(offerEndpoint.delete), controller.remove);

// // Purge offer
router.delete(resolve_route(offerEndpoint.purge), controller.removeAll);

export default router;

