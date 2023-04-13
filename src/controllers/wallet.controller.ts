// import debug from "debug";
// import { Response } from "express";
// import { abilitiesFilter } from "../abilities/filter.ability";
// import { getWalletByTenantId, registerWallet } from "../services/wallet.service";
// import { ICustomRequest } from "../types/app.type";
// import { outItemFromList } from "../utils/out-item-from-list.helper";
// import { handlePrismaError } from "../utils/prisma-error.helper";
// import CustomResponse from "../utils/response.helper";

// export const retrive = async (req: ICustomRequest, res: Response) => {
//     const response = new CustomResponse(res);
//     const logger = debug('coollionfi:wallet:retrive');

//     try {
//         const { tenantId } = req.auth!;

//         const wallet = await getWalletByTenantId(tenantId);

//         if (!wallet)
//             return response[404]({ message: "Record not found!" });

//         const testOwner = wallet.owner !== tenantId;

//         if (testOwner)
//             return response[403]({ message: "You do not have permission to view the selected record information." });

//         const filteredWallet = await abilitiesFilter({
//             subject: "Wallet",
//             abilities: req.abilities as Required<ICustomRequest>["abilities"],
//             input: [wallet],
//         });
//         const finalWallet = await outItemFromList(filteredWallet);

//         response[200]({ data: finalWallet });
//     } catch (err) {
//         logger(err);
//         response[500]({ message: "An error occurred while reading information." });
//     }
// };


// export const register = async (req: ICustomRequest, res: Response) => {
//     const response = new CustomResponse(res);
//     const logger = debug('coollionfi:wallet:register');

//     try {
//         const { userId, tenantId } = req.auth!;
//         const wallet = await getWalletByTenantId(tenantId);

//         if (wallet)
//             return response[400]({ message: "You already have a wallet!" });

//         await registerWallet({ owner: tenantId });
//         logger(`New wallet registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

//         response[201]({ message: "Wallet registered successfully." });
//     } catch (err) {
//         const errors = handlePrismaError(err, logger);

//         if (errors.length > 0)
//             response[409]({
//                 message: "Conflict in database.",
//                 errors
//             });
//         else {
//             logger(err);
//             response[500]({ message: "An error occurred while registering the wallet." });
//         }
//     }

// };

