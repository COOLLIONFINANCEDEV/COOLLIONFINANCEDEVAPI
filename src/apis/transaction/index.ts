// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/transaction/controller'
import { Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';

const transactionEndpoint = endpoints.transactions;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new transactions
router.post(resolve_route(transactionEndpoint.create), controller.create);

// // List transactions
router.get(resolve_route(transactionEndpoint.list), controller.findAll);

// Retrieve transactions
router.get(resolve_route(transactionEndpoint.retrive), controller.findOne);

// Retrieve transactions by user
router.get(resolve_route(transactionEndpoint.retriveByWallet), controller.findByWallet);

// // Update a transactions
router.put(resolve_route(transactionEndpoint.update), controller.update);

// // Delete a transactions
router.delete(resolve_route(transactionEndpoint.delete), controller.remove);

// // Delete a transactions by user
// router.delete(resolve_route(transactionEndpoint.deleteByWallet), controller.removeByWallet);

// // Purge transactions
router.delete(resolve_route(transactionEndpoint.purge), controller.removeAll);

export default router;

