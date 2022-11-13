// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/investment/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication from 'src/middlewares/authentication';

const investmentEndpoint = endpoints.investment;
const router: Router = Router();
// var router = require("express").Router();

// Create a new offer doc
router.post(resolve_route(investmentEndpoint.create), authentication, controller.create);

// List offers docs
router.get(resolve_route(investmentEndpoint.list), authentication, controller.findAll);

// Retrieve offer doc
router.get(resolve_route(investmentEndpoint.retrive), authentication, controller.findOne);

// Retrieve offer docs by offer
router.get(resolve_route(investmentEndpoint.retriveByOffer), authentication, controller.findByOffer);

// Retrieve offer docs by wallet
router.get(resolve_route(investmentEndpoint.retriveByWallet), authentication, controller.findByWallet);

// Update a offer doc
router.put(resolve_route(investmentEndpoint.update), authentication, controller.update);

// Delete a offer doc
router.delete(resolve_route(investmentEndpoint.delete), authentication, controller.remove);

// Delete a offer docs by offer
// router.delete(resolve_route(investmentEndpoint.deleteByOffer), authentication, controller.removeByOffer);

// Delete a offer docs by wallet
// router.delete(resolve_route(investmentEndpoint.deleteByWallet), authentication, controller.removeByWallet);

// // Purge offers
router.delete(resolve_route(investmentEndpoint.purge), authentication, controller.removeAll);

export default router;

