import { Response } from "express";
import { TResponse } from "../types/utils.type";


class CustomResponse {
    response: Response;

    constructor(res: Response) {
        this.response = res;
    }

    static make_response(options: TResponse) {
        return {
            success: options.success !== undefined ? options.success : true,
            message: options.message || "",
            data: options.data || [],
            errors: options.errors || []
        };
    }

    /**
     * ANY RESPONSE
     * 
     * @param responseData
     * @param statusCode 200 <= statusCode <= 599
     */
    sendResponse(responseData: TResponse, statusCode: number) {
        if (statusCode < 200 || statusCode > 599)
            throw new Error("Success status code range (200 - 599) exceeded!");

        responseData = CustomResponse.make_response(responseData);
        this.response.status(statusCode).send(responseData);
    }

    /**
     * SUCCESS RESPONSE,  200 <= STATUS <= 299
     */
    success({ responseData, statusCode = 200 }: { responseData: TResponse; statusCode?: number; }) {
        if (statusCode < 200 || statusCode > 299)
            throw new Error("Success status code range (200 - 299) exceeded!");

        responseData.success = true;
        responseData.message = responseData.message || "Ok";
        this.sendResponse(responseData, statusCode);
    }

    /**
     * ERROR RESPONSE,  400 <= STATUS <= 599
     */
    error({ responseData, statusCode = 500 }: { responseData: TResponse; statusCode?: number; }) {
        if (statusCode < 400 || statusCode > 599 || !Number.isInteger(statusCode))
            throw new Error("Success status code range (200 - 299) exceeded!");

        responseData.success = false;
        responseData.message = responseData.message || "Internal Server Error";
        this.sendResponse(responseData, statusCode);
    }

    /**
     * OK
     */
    200(responseData: TResponse = {}) {
        this.success({ responseData });
    }

    /**
     * CREATED 
     */
    201(responseData: TResponse = {}) {
        responseData.message = responseData.message || "Created";
        this.success({ responseData, statusCode: 201 });
    }

    /**
     * NO CONTENT
     */

    204(responseData: TResponse = {}) {
        responseData.success = true;
        responseData.message = responseData.message || "No Content";
        this.sendResponse(responseData, 204);
    }

    /**
     * BAD REQUEST
     */
    400(responseData: TResponse = {}) {
        responseData.message = responseData.message || "Bad Request";
        this.error({ responseData: responseData, statusCode: 400 });
    }

    /**
     * UNAUTHORIZED
     */
    401(responseData: TResponse = {}) {
        responseData.message = responseData.message || "Unauthorized";
        this.error({ responseData, statusCode: 401 });
    }

    /**
     * FORBIDDEN
     */
    403(responseData: TResponse = {}) {
        responseData.message = responseData.message || "Forbidden";
        this.error({ responseData, statusCode: 403 });
    }

    /**
     * NOT FOUND
     */
    404(responseData: TResponse = {}) {
        responseData.message = responseData.message || "Not Found";
        this.error({ responseData, statusCode: 404 });
    }

    /**
     * CONFLICT
     */
    409(responseData: TResponse = {}) {
        responseData.message = responseData.message || "Conflict";
        this.error({ responseData, statusCode: 409 });
    }

    /**
     * INTERNAL SERVER ERROR
     */
    500(responseData: TResponse = {}) {
        this.error({ responseData });
    }
}

export default CustomResponse;
