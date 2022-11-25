import { Response } from "express";
import make_response from "src/helpers/make_response";

function error_404(val: any, res: Response, message?: string) {
    if (!val) {
        res.status(404).send(make_response(true, message || "Not Found"));
        return false;
    }

    if (val && val.code === 'P2025') {
        res.status(404).send(make_response(true, message || "Not Found"));

        return false;
    }

    return true
}

export default error_404;


