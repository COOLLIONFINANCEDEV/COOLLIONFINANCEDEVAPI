// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/offer_repayment_plan/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const offerRepaymentPlanEndpoint = endpoints.offerRepaymentPlan;
const router: Router = Router();
// var router = require("express").Router();

// Create a new offer doc
router.post(resolve_route(offerRepaymentPlanEndpoint.create), controller.create);

// List offers docs
router.get(resolve_route(offerRepaymentPlanEndpoint.list), controller.findAll);

// Retrieve offer doc
router.get(resolve_route(offerRepaymentPlanEndpoint.retrive), controller.findOne);

// Retrieve offer docs 
router.get(resolve_route(offerRepaymentPlanEndpoint.retriveByOffer), controller.findByOffer);

// Update a offer doc
router.put(resolve_route(offerRepaymentPlanEndpoint.update), controller.update);

// Delete a offer doc
router.delete(resolve_route(offerRepaymentPlanEndpoint.delete), controller.remove);

// Delete a offer docs
router.delete(resolve_route(offerRepaymentPlanEndpoint.deleteByOffer), controller.removeByOffer);

// // Purge offers
router.delete(resolve_route(offerRepaymentPlanEndpoint.purge), controller.removeAll);

export default router;

