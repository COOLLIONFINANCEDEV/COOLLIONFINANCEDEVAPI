import { Response } from "express"
import make_response from "src/helpers/make_response";

export const error_invalid_to = (res: Response, error: { [code: string]: number }) => {
    if (error.code === 60200) {
        res.status(400).send(make_response(true, `Phone number possibly invalid check it to change or use another channel !`));

        return false;
    }

    return true;
}


export const error_invalid_code = (res: Response, error: { [code: string]: number }) => {
    if (error.code === 20404) {
        res.status(200).send(make_response(true, `Pendding`));

        return false;
    }

    return true;
}