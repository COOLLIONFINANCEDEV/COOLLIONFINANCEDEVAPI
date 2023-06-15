import { PaymentMethod } from "@prisma/client";
import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { app as appConfig } from "../configs/app.conf";
import { deletePaymentMethod, getAllPaymentMethods, getPaymentMethodById, registerPaymentMethod, updatePaymentMethod } from "../services/payment-method.service";
// import { getWalletByTenantId } from "../services/wallet.service";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";

export const listOther = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:paymentMethod:list');

    try {
        const { otherId, page, perPage } = req.params;

        if (isNaN(Number(otherId)))
            return response[400]({ message: 'Invalid query parameter otherId.' });

        // const wallet = await getWalletByTenantId(Number(otherId));

        // if (!wallet)
        //     return response[404]({ message: "The selected tenant does not have a wallet!" });

        // const paymentMethods = await getAllPaymentMethods({
        //     where: { walletId: wallet.id, deleted: false },
        //     page: Number(page), perPage: Number(perPage)
        // });
        
        const paymentMethods = await getAllPaymentMethods({
            where: { owner: Number(otherId), deleted: false },
            page: Number(page), perPage: Number(perPage)
        });

        const filteredPaymentMethods = await abilitiesFilter({
            subject: "PaymentMethod",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: paymentMethods,
            selfInput: false
        }, ({ subject, action, abilities, input }) => {
            const filteredInput = input.map((project) => {
                const filteredValue: Record<string, any> = {};

                Object.keys(project).forEach((item) => {
                    if (abilities.can(action!, subject, `${item}Other`))
                        filteredValue[item] = project[item as keyof PaymentMethod];
                });

                return filteredValue as PaymentMethod;
            });

            return filteredInput;
        });
        const finalPaymentMethods = await outItemFromList(filteredPaymentMethods);

        response[200]({ data: finalPaymentMethods });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:paymentMethod:list');

    try {
        const { tenantId } = req.auth!;
        const { page, perPage } = req.params;

        // const wallet = await getWalletByTenantId(tenantId);

        // if (!wallet)
        //     return response[404]({ message: "You don’t have a wallet!" });

        // const paymentMethods = await getAllPaymentMethods({
        //     where: { walletId: wallet.id, deleted: false },
        //     page: Number(page), perPage: Number(perPage)
        // });
        
        const paymentMethods = await getAllPaymentMethods({
            where: { owner: tenantId, deleted: false },
            page: Number(page), perPage: Number(perPage)
        });

        const filteredPaymentMethods = await abilitiesFilter({
            subject: "PaymentMethod",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: paymentMethods
        });
        const finalPaymentMethods = await outItemFromList(filteredPaymentMethods);

        response[200]({ data: finalPaymentMethods });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:paymentMethod:retrive');

    try {
        const { tenantId } = req.auth!;
        const { paymentMethodId } = req.params;

        if (isNaN(Number(paymentMethodId)))
            return response[400]({ message: 'Invalid query parameter paymentMethodId.' });

        const paymentMethod = await getPaymentMethodById(Number(paymentMethodId));

        if (!paymentMethod)
            return response[404]({ message: "Record not found!" });

        const { can } = req.abilities!;

        if (!can("manage", "PaymentMethod", "disabled")) {
            // const wallet = await getWalletByTenantId(tenantId);

            // if (!wallet)
            //     return response[404]({ message: "You don’t have a wallet!" });

            // if (paymentMethod.walletId !== wallet.id)
            //     return response[403]({ message: "You do not have permission to update the selected record!" })
            
            if (paymentMethod.owner !== tenantId)
                return response[403]({ message: "You do not have permission to update the selected record!" })
        }

        const filteredPaymentMethod = await abilitiesFilter({
            subject: "PaymentMethod",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [paymentMethod],
        });
        const finalPaymentMethod = await outItemFromList(filteredPaymentMethod);

        response[200]({ data: finalPaymentMethod });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:paymentMethod:delete');

    try {
        const { tenantId } = req.auth!;
        const { paymentMethodId } = req.params;

        if (isNaN(Number(paymentMethodId)))
            return response[400]({ message: 'Invalid query parameter paymentMethodId.' });

        const paymentMethod = await getPaymentMethodById(Number(paymentMethodId));

        if (!paymentMethod)
            return response[404]({ message: "The record to delete not found!" });

        // const wallet = await getWalletByTenantId(tenantId);

        // if (!wallet)
        //     return response[404]({ message: "You don’t have a wallet!" });

        // if (paymentMethod.walletId !== wallet.id)
        //     return response[403]({ message: "You do not have permission to delete the selected record!" })
        
        if (paymentMethod.owner !== tenantId)
            return response[403]({ message: "You do not have permission to delete the selected record!" })

        await deletePaymentMethod(Number(paymentMethodId));
        response[204]({ message: 'Successfully deleted.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0 && errors[0].field === "RecordNotFound") {
            response[404]({ message: "The record to delete not found!" });
        } else {
            logger(err);
            response[500]({ message: "An error occurred while deleting information." });
        }
    }
};


export const update = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:paymentMethod:update');

    try {
        const { tenantId } = req.auth!;
        const { paymentMethodId } = req.params;
        const { can } = req.abilities!;

        if (isNaN(Number(paymentMethodId)))
            return response[400]({ message: 'Invalid query parameter paymentMethodId.' });

        const paymentMethod = await getPaymentMethodById(Number(paymentMethodId));

        if (!paymentMethod)
            return response[404]({ message: "The record to update not found!" });

        if (!can("manage", "PaymentMethod", "disabled")) {
            // const wallet = await getWalletByTenantId(tenantId);

            // if (!wallet)
            //     return response[404]({ message: "You don’t have a wallet!" });

            // if (paymentMethod.walletId !== wallet.id)
            //     return response[403]({ message: "You do not have permission to update the selected record!" })
            
            if (paymentMethod.owner !== tenantId)
                return response[403]({ message: "You do not have permission to update the selected record!" })
        }

        await updatePaymentMethod(paymentMethod.id, req.body);
        response[200]({ message: 'Informations updated successfully.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while updating information." });
        }
    }
};


export const register = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:paymentMethod:register');

    try {
        const { userId, tenantId } = req.auth!;
        // let wallet = await getWalletByTenantId(tenantId);

        // if (!wallet) {
        //     if (can("create", "Wallet"))
        //         wallet = await registerWallet({ owner: tenantId });
        //     else
        //         return response[403]({ message: "You have no permission to create wallet. You must have a wallet account to add a payment method." });
        // }

        // const paymentMethods = await getAllPaymentMethods({ where: { walletId: wallet.id, deleted: false } });
        const paymentMethods = await getAllPaymentMethods({ where: { owner: tenantId, deleted: false } });

        if (paymentMethods.length >= appConfig.maxPaymentMethods)
            return response[409]({
                message: `Max payment method exceeded, you have ${appConfig.maxPaymentMethods} payment(s) method(s)`
            });

        let duplicateField = "";
        const notDuplicate = paymentMethods.every((paymentMethod) => {
            const keys = Object.keys(paymentMethod);

            return keys.every((key) => {
                duplicateField = key;
                const value = paymentMethod[key as keyof typeof paymentMethod];

                return value === null ? true : value !== req.body[key];
            });
        });

        if (!notDuplicate)
            return response[400]({
                message: "Conflict in database.",
                errors: [{
                    field: duplicateField,
                    message: `The value of the field "${duplicateField}" already used.`
                }]
            })

        await registerPaymentMethod(req.body);
        logger(`New paymentMethod registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        response[201]({ message: "PaymentMethod registered successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while registering the paymentMethod." });
        }
    }

};
