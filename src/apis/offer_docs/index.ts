// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/offer_docs/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const userDocsEndpoint = endpoints.offerDocs;
const router: Router = Router();
// var router = require("express").Router();

// Create a new offer doc
router.post(resolve_route(userDocsEndpoint.create), controller.create);

// List offers docs
router.get(resolve_route(userDocsEndpoint.list), controller.findAll);

// Retrieve offer doc
router.get(resolve_route(userDocsEndpoint.retrive), controller.findOne);

// Retrieve offer docs 
router.get(resolve_route(userDocsEndpoint.retriveByOffer), controller.findByOffer);

// Update a offer doc
router.put(resolve_route(userDocsEndpoint.update), controller.update);

// Delete a offer doc
router.delete(resolve_route(userDocsEndpoint.delete), controller.remove);

// Delete a offer docs
router.delete(resolve_route(userDocsEndpoint.deleteByOffer), controller.removeByOffer);

// // Purge offers
router.delete(resolve_route(userDocsEndpoint.purge), controller.removeAll);

export default router;

