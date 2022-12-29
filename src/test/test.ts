import axios from "axios";
import { assert } from "console";
import { cinetpayConfig, endpoints } from "src/config";
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

// console.log(get_variable());


// const variable = "3";

// function get_variable() {
//     return variable;
// }














var data = JSON.stringify({
    "apikey": cinetpayConfig.API_KEY,
    "site_id": cinetpayConfig.SITE_ID,
    "transaction_id": Math.floor(Math.random() * 100000000).toString(), //
    "amount": 100,
    "currency": "XOF",
    "alternative_currency": "",
    "description": " TEST INTEGRATION ",
    "customer_id": "172",
    "customer_name": "KOUADIO",
    "customer_surname": "Francisse",
    "customer_email": "harrissylver@gmail.com",
    "customer_phone_number": "+225004315545",
    "customer_address": "Antananarivo",
    "customer_city": "Antananarivo",
    "customer_country": "CM",
    "customer_state": "CM",
    "customer_zip_code": "065100",
    "notify_url": "https://webhook.site/d1dbbb89-52c7-49af-a689-b3c412df820d",
    "return_url": "https://webhook.site/d1dbbb89-52c7-49af-a689-b3c412df820d",
    "channels": "ALL",
    "metadata": "user1",
    "lang": "FR",
    "invoice_data": {
        "Donnee1": "",
        "Donnee2": "",
        "Donnee3": ""
    }
});

var config = {
    method: 'post',
    url: 'https://api-checkout.cinetpay.com/v2/payment',
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
