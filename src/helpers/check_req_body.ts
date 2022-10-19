import { Request, Response } from "express";

function check_req_body(req: Request, res: Response) {
    if (!req.body || Object.keys(req.body).length == 0) {
        res.status(400).send({
            message: "Content can not be empty!"
        });

        return false;
    }
    
    return true;
}

export default check_req_body;