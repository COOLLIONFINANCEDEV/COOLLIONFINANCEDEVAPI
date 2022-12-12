import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import Service from 'src/apis/investment/services';
import UsersService from 'src/apis/users/services';
import OfferService from 'src/apis/offer/services';
import TransactionrService from 'src/apis/transaction/services';
import { paginationConfig } from 'src/config';
import check_req_body from 'src/helpers/check_req_body';
import make_response from 'src/helpers/make_response';
import serializer from 'src/middlewares/data_serializer';
import error_404 from 'src/middlewares/error_404';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import validator from 'validator';
import check_type_and_return_any from 'src/helpers/check_type_and_return_any';
import customTransaction from 'src/types/transaction';
import sg_send_email from 'src/helpers/send_email';

const service = new Service();
const usersService = new UsersService();
const offerService = new OfferService();
const transactionService = new TransactionrService();


// Create and Save a new investment docs
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        units: 'not_null, float',
        offer_id: "not_null, integer",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const offer = await offerService.simple_retrive(data.offer_id);
        const user = await usersService.retrive(res.locals.auth.user_id);
        const userWallet = Number(user?.wallet?.amount);
        const investments = offer ? offer?.investment : [];
        const investmentAmount = data.units * Number(offer?.price_per_unit);
        let raisedFund = 0;

        for (let investment of investments)
            raisedFund += investment.amount;

        if (raisedFund === offer?.total_investment_to_raise) {
            res.send(make_response(false, "The proposed investment is closed."));
            return;
        }

        const unitsToRaised = (raisedFund / Number(offer?.price_per_unit)) - Number(offer?.number_of_unit);

        if (data.units <= unitsToRaised) {
            res.send(make_response(false, `You have exceeded the number of units that can be invested. Availlable units : ${unitsToRaised}.`));
            return;
        }

        if (investmentAmount > userWallet) {
            res.send(make_response(false, `You have exceeded the amount on your wallet, please make a deposit on your wallet to access the investment offer. Remaining amount: ${investmentAmount - userWallet}.`));
            return;
        }

        const newInvestment = {
            amount: investmentAmount,
            offer_id: data.offer_id,
            wallet_id: user?.wallet?.id,
        }

        const newTransaction: customTransaction = {
            amount: investmentAmount,
            type: "investment",
            wallet_id: Number(user?.wallet?.id),
            currency: "XOF",
            service: "coollionfi",
            transaction_id: uuidv4(),
            status: "ACCEPTED"
        }

        await transactionService.create(check_type_and_return_any(newTransaction));
        await service.create(check_type_and_return_any(newInvestment));
        // Notify the customer by email that his invesment is accepted

        const username = user?.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}` : user?.last_name
                ? user.last_name : user?.first_name
                    ? user.first_name : "Dear";

        // notify the customer by email that his transaction accepted
        await sg_send_email({
            to: String(user?.email),
            templateData: {
                subject: "Investment info",
                title: "INVESTMENT ACCEPTED",
                username: username,
                body: `Your investment under Offer ${offer?.name} has been accepted. See more details on your dashboard. Now, wait for your winnings.\nSee more  offer:`
            }
        }).catch();

        res.status(201).send(make_response(false, "Invesment accepted."));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        throw e;
    }
}


// Update and Save a new investment docs
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float, optional',
        wallet_id: 'not_null, integer, optional',
        offer_id: "not_null, integer, optional",
        is_deleted: 'not_null, boolean, optional',
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const update = await service.update(Number(id), res.locals.auth?.user_id, data);
        res.send(make_response(false, update));
    } catch (e) {
        console.error(e);

        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all investment docs from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const offers = await service.get({ page: page, perPage: perPage });

    if (!error_404(offers, res)) return;

    res.send(make_response(false, offers));
};

// Retrive investment docs by offer
export const findByOffer = async (req: Request, res: Response) => {
    const id = req.params.id
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const offers = await service.getByOffer(Number(id), res.locals.auth?.user_id, { page: page, perPage: perPage });

    if (!error_404(offers, res)) return;

    res.send(make_response(false, offers));
};

// Retrive investment docs by wallet
export const findByWallet = async (req: Request, res: Response) => {
    const id = req.params.id
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const offers = await service.getByWallet(Number(id), res.locals.auth?.user_id, { page: page, perPage: perPage });

    if (!error_404(offers, res)) return;

    res.send(make_response(false, offers));
};


// Retrive investment docs
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const investment = await service.retrive(Number(id), res.locals.auth?.user_id);

    if (!error_404(investment, res)) return;

    res.send(make_response(false, investment));
};


// Soft delete investment doc
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.remove(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete investment docs
export const removeByOffer = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteByOffer(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete investment docs
export const removeByWallet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteByWallet(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge offers
export const removeAll = async (req: Request, res: Response) => {
    const result = await service.deleteAll("investment");

    res.send(make_response(false, result));
};




// // Delete all investment
// exports.deleteAll = (req: Request, res: Response) => {
//     Service.purge((err, data) => {
//         if (err) {
//             res.status(500);

//             if (err.kind == 'not_found') {
//                 res.status(404);
//                 err.message = "Not Found!";
//             }

//             res.send({
//                 message:
//                     err.message || "Some error occurred while deleting the investment."
//             });
//         }
//         else res.send(data);
//     });
// };

