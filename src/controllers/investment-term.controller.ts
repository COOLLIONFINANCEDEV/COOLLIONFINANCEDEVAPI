import { Response } from "express";
import { ICustomRequest } from "../types/app.type";
import debug from "debug";
import { getAllInvestmentTerms, getInvestmentTermById, registerInvestmentTerm, updateInvestmentTerm } from "../services/investment-term.service";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import { abilitiesFilter } from "../abilities/filter.ability";
import { outItemFromList } from "../utils/out-item-from-list.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:investmentTerm:list');

    try {
        const { page, perPage } = req.params;
        const investmentTerms = await getAllInvestmentTerms({ page: Number(page), perPage: Number(perPage) });
        const filteredInvestmentTerms = await abilitiesFilter({
            subject: "InvestmentTerm",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: investmentTerms,
        });
        const finalInvestmentTerms = await outItemFromList(filteredInvestmentTerms);

        response[200]({ data: finalInvestmentTerms });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:investmentTerm:retrive');

    try {
        const { investmentTermId } = req.params;

        if (isNaN(Number(investmentTermId)))
            return response[400]({ message: 'Invalid query parameter investmentTermId.' });

        const investmentTerm = await getInvestmentTermById(Number(investmentTermId));

        if (!investmentTerm)
            return response[404]({ message: "Record not found!" });

        const filteredInvestmentTerm = await abilitiesFilter({
            subject: "InvestmentTerm",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [investmentTerm],
        });
        const finalInvestmentTerm = await outItemFromList(filteredInvestmentTerm);

        response[200]({ data: finalInvestmentTerm });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const update = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:investmentTerm:update');

    try {
        const { investmentTermId } = req.params;

        if (isNaN(Number(investmentTermId)))
            return response[400]({ message: 'Invalid query parameter investmentTermId.' });

        const investmentTerm = await getInvestmentTermById(Number(investmentTermId));

        if (!investmentTerm)
            return response[404]({ message: "The record to update not found!" });

        await updateInvestmentTerm(investmentTerm.id, req.body);
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
    const logger = debug('coollionfi:investmentTerm:register');

    try {
        const { userId, tenantId } = req.auth!;

        await registerInvestmentTerm(req.body);
        logger(`New investmentTerm registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        response[201]({ message: "Investment term registered successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while registering the tenant." });
        }
    }

};
