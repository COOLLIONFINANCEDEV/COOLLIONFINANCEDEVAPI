import { Room } from "@prisma/client";
import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { deleteMessage, getAllMessages, getMessageById, getMessageByParam, registerMessage } from "../services/message.service";
import { getRoomById, getRoomByParam } from "../services/room.service";
import io from "../socket";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";

export const listRoom = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:chat:listRoom');

    try {
        const roomUUIDs = req.auth!.rooms;;
        const rooms: Room[] = [];

        for (const uuid of roomUUIDs) {
            const room = await getRoomByParam({ uuid });

            if (room) rooms.push(room);
        }

        const filteredRooms = await abilitiesFilter({
            subject: "Room",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: rooms,
        });
        const finalRooms = await outItemFromList(filteredRooms);

        response[200]({ data: finalRooms });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retriveRoom = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:chat:retriveRoom');

    try {
        const { rooms } = req.auth!;
        const { roomId } = req.params;

        if (isNaN(Number(roomId)))
            return response[400]({ message: 'Invalid query parameter roomId.' });

        const room = await getRoomById(Number(roomId));

        if (!room)
            return response[404]({ message: "Room not found!" });

        if (!rooms.includes(room.uuid))
            return response[403]({ message: "You have not permission to view message history of the selected room." });

        const filteredRoom = await abilitiesFilter({
            subject: "Room",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [room],
        });
        const finalRoom = await outItemFromList(filteredRoom);

        response[200]({ data: finalRoom });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const history = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:chat:history');

    try {
        const { rooms } = req.auth!;
        const { roomId, page, perPage } = req.params;

        if (isNaN(Number(roomId)))
            return response[400]({ message: 'Invalid query parameter roomId.' });

        const room = await getRoomById(Number(roomId));

        if (!room)
            return response[404]({ message: "Room not found!" });

        if (!rooms.includes(room.uuid))
            return response[403]({ message: "You have not permission to view message history of the selected room." });

        const messages = await getAllMessages({
            where: { roomId: Number(roomId) },
            page: Number(page), perPage: Number(perPage) || 20
        });

        const filteredMessages = await abilitiesFilter({
            subject: "Message",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: messages,
        });
        const finalMessages = await outItemFromList(filteredMessages);

        response[200]({ data: finalMessages });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:chat:delete');

    try {
        const { userId, rooms } = req.auth!;
        const { messageId } = req.params;

        if (isNaN(Number(messageId)))
            return response[400]({ message: 'Invalid query parameter messageId.' });

        const message = await getMessageById(Number(messageId));

        if (!message)
            return response[404]({ message: "The record to delete not found!" });

        const room = await getRoomById(message.roomId);

        if (!room)
            return response[404]({ message: "The record to delete not found!" });

        if (message.userId !== userId || !rooms.includes(room.uuid))
            return response[403]({ message: "You do not have permission to delete the selected record!" });

        const reccord = await deleteMessage(Number(messageId));

        io.to(room.uuid).emit("deleteMessage", reccord);

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


export const post = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:chat:post');

    try {
        const { roomId, message, replyTo } = req.body;
        const { userId, rooms } = req.auth!;
        const room = await getRoomById(roomId);

        if (!room)
            return response[404]({ message: "Room not found!" });

        if (!rooms.includes(room.uuid))
            return response[403]({ message: "Can not post message in the selected room." });

        const newMessage = {
            content: message,
            userId,
            roomId: room.id,
            replyTo: undefined
        }

        if (replyTo) {
            const replyToMessage = await getMessageByParam({ replyTo, deleted: false });

            if (replyToMessage) newMessage.replyTo = replyTo;
        }

        const reccord = await registerMessage(newMessage);
        logger(`New message posted successfully. creator: ${userId}`);

        io.to(room.uuid).emit("newMessage", reccord);

        response[201]({ message: "Message posted successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while posting the message." });
        }
    }

};
