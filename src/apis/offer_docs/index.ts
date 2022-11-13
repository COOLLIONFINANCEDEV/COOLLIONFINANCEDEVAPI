// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/offer_docs/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication from 'src/middlewares/authentication';

const userDocsEndpoint = endpoints.offerDocs;
const router: Router = Router();
// var router = require("express").Router();

// Create a new offer doc
router.post(resolve_route(userDocsEndpoint.create), authentication, controller.create);

// List offers docs
router.get(resolve_route(userDocsEndpoint.list), authentication, controller.findAll);

// Retrieve offer doc
router.get(resolve_route(userDocsEndpoint.retrive), authentication, controller.findOne);

// Retrieve offer docs 
router.get(resolve_route(userDocsEndpoint.retriveByOffer), authentication, controller.findByOffer);

// Update a offer doc
router.put(resolve_route(userDocsEndpoint.update), authentication, controller.update);

// Delete a offer doc
router.delete(resolve_route(userDocsEndpoint.delete), authentication, controller.remove);

// Delete a offer docs
// router.delete(resolve_route(userDocsEndpoint.deleteByOffer), authentication, controller.removeByOffer);

// // Purge offers
router.delete(resolve_route(userDocsEndpoint.purge), authentication, controller.removeAll);

export default router;

