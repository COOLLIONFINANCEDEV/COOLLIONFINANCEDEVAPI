import axios from "axios";
import { assert } from "console";
import check_type_and_return_any from "src/helpers/check_type_and_return_any";
import validator from "validator";

// async function test() {
//     try {
//         const response = await axios.get("https://api.coollionfi.com/");
//         console.log(response);
//         return response;
//     } catch (reason) {
//         return reason;
//     }
// }


// const result = test();

// console.log(result);

// async function result2(): Promise<unknown> {
//     return await test();
// }

// console.log(result2());

// function format_date(dateToformat: string | number) {
//     const date = new Date(dateToformat);

//     return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
// }

// function is_date(str: any): boolean {
//     if ((str.split("/")).length == 3 || (str.split("-")).length == 3)
//         return validator.toDate(String(str)) ? true : false;
//     return false;
// }

// const res = is_date("2022-05-24T00:00:00.000Z");

// console.log(res, format_date("2022-05-24T00:00:00.000Z"));


// type ty = "ac" | "ab";

// const test: ty = check_type_and_return_any<any>("ad").toUpperCase();
// console.log(test);

console.log(get_variable());


const variable = "3";

function get_variable() {
    return variable;
}