// const controller = require("../controllers/userController.js");
import * as controller from 'src/apis/transaction/controller'
import { NextFunction, Request, Response, Router } from 'express';
import { endpoints } from 'config/index';
import resolve_route from 'src/helpers/resolve_route';
import authentication from 'src/middlewares/authentication';

const transactionEndpoint = endpoints.transactions;
const router: Router = Router();
// var router = require("express").Router();

// // Create a new transactions
router.post(resolve_route(transactionEndpoint.deposit), authentication, controller.deposit);

// // Create a new transactions
router.post(resolve_route(transactionEndpoint.withdrawal), authentication, controller.withdrawal);

// // List transactions
router.get(resolve_route(transactionEndpoint.list), authentication, controller.findAll);

// Retrieve transactions
router.get(resolve_route(transactionEndpoint.retrive), authentication, controller.findOne);

// Retrieve transactions by wallet
router.get(resolve_route(transactionEndpoint.retriveByWallet), authentication, controller.findByWallet);

router.post(resolve_route(transactionEndpoint.payBorrower), authentication, controller.payBorrower);

// // Update a transactions
// router.put(resolve_route(transactionEndpoint.update), authentication, controller.update);

// // Delete a transactions
// router.delete(resolve_route(transactionEndpoint.delete), authentication, controller.remove);

// // Delete a transactions by user
// router.delete(resolve_route(transactionEndpoint.deleteByWallet), controller.removeByWallet);

// // Purge transactions
// router.delete(resolve_route(transactionEndpoint.purge), authentication, controller.removeAll);

// Used by cinetpay to ping our server
router.get(resolve_route(transactionEndpoint.CinetpayPaymentNotificationUrl), logger({ msg: "Payment notification called: GET" }), (req: Request, res: Response) => res.send());

// Used by cinetpay to notify a payment state
router.post(resolve_route(transactionEndpoint.CinetpayPaymentNotificationUrl), logger({ msg: "Payment notification called: POST" }), controller.cinetpay_payment_notification_url);

// Used by cinetpay to ping our server
router.get(resolve_route(transactionEndpoint.CinetpayTransferNotificationUrl), logger({ msg: "Transfer notification called: GET" }), (req: Request, res: Response) => res.send());


// Used by cinetpay to notify a payment state
router.post(resolve_route(transactionEndpoint.CinetpayTransferNotificationUrl), logger({ msg: "Transfer notification called: POST" }), controller.cinetpay_transfer_notification_url);

export default router;


function logger({ msg }: { msg: any; }) {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(msg);
        next();
    };
}
