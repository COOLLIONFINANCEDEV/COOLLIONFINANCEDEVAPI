import { NextFunction, Request, Response } from "express";
import init_object_key from "src/helpers/init_object_key";

export default function perform_query_parameter(req: Request, res: Response, next: NextFunction) {
    // /search?q=abidjan&advanced=1&filter[]=gt,20&filter.lt=78
    const queryList = req.url.substring(req.url.indexOf("?") + 1);
    const queries = queryList.split("&"); // [ 'q=abidjan', 'advanced=1', 'filter[]=gt,20', 'filter.lt=78' ]
    const queryKeyValue: { [x: string]: any } = {};
    queries.forEach(query => {
        const [keys, value] = query.split("=");
        let [key, subKey] = keys.split(".");

        // queryKeyValue[key] = subKey ? { [subKey]: value } : value;
        if (subKey) {
            init_object_key(queryKeyValue, key);
            queryKeyValue[key][subKey] = value;
        }
        else if (key.substring(key.length - 2) === "[]") {
            key = key.substring(0, key.length - 2);
            if (queryKeyValue[key] instanceof Array) queryKeyValue[key].push(value);
            else if (!queryKeyValue[key]) queryKeyValue[key] = [value];
            else console.warn("Duplicate key:", key);
        }
        else queryKeyValue[key] = value;
    });

    req.query = queryKeyValue;

    next();
}