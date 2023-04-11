import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../services/user.service";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import { sendMagicLink } from "../utils/send-magic-link.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:user:list');

    try {
        const { userId } = req.auth!;
        const { page, perPage } = req.params;
        const users = await getAllUsers({ where: { id: { not: userId }, deleted: false }, page: Number(page), perPage: Number(perPage) });
        const filteredUsers = await abilitiesFilter({
            subject: "User",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: users,
            selfInput: false
        });
        const finalUsers = await outItemFromList(filteredUsers);

        response[200]({ data: finalUsers });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:user:retrive');

    try {
        let userId = req.auth!.userId;
        const paramUserId = req.params.userId;

        if (paramUserId && isNaN(Number(paramUserId)))
            return response[400]({ message: 'Invalid query parameter userId.' });
        else userId = Number(paramUserId) || userId;

        const user = await getUserById(userId);

        if (!user)
            return response[404]({ message: "The record to read not found!" });

        const filteredUser = await abilitiesFilter({
            subject: "User",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [user],
            selfInput: userId === req.auth?.userId
        });
        const finalUser = await outItemFromList(filteredUser);

        response[200]({ data: finalUser });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:user:delete');

    try {
        const { userId } = req.auth!;

        await deleteUser(userId);
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
    const logger = debug('coollionfi:user:update');

    try {
        const { userId } = req.auth!;
        // const { userId } = req.params;

        // if (isNaN(Number(userId)))
        //     return response[400]({ message: 'Invalid query parameter userId.' });

        const user = await getUserById(Number(userId));

        if (!user)
            return response[404]({ message: "The record to update not found!" });

        const { email, phone, phone2 } = req.body;
        let { emailVerified, phoneVerified, phone2Verified } = user;
        let emailActivationMsg = "";

        if (email && email !== user.email) {
            emailVerified = false;
            emailActivationMsg = "Please open the magic link in the email we sent you to activate your email address.";

            await sendMagicLink(user.id, email);
            logger("Activation account email sent");
        }

        phoneVerified = phone && phone !== user.phone ? false : phoneVerified;
        phone2Verified = phone2 && phone2 !== user.phone2 ? false : phone2Verified;

        await updateUser(user.id, { emailVerified, phoneVerified, phone2Verified, ...req.body });
        response[200]({ message: `Informations updated successfully! ${emailActivationMsg}` });
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
