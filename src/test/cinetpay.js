    const axios = require('axios');
    // const fetch = require('node-fetch');
    // import fetch from 'node-fetch';
    // import axios from 'axios';


    var data = JSON.stringify({
      "apikey": "14047243215ebd680ed0d0c0.07903569",
      "site_id": '622120',
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
      data : data
    };

    // console.log(data);
/*
// fetch(url, {
//     method: 'POST',
//     body: data,
//     headers: { 'Content-Type': 'application/json' }
// }).then(res => res.json())
//   .then(json => console.log(json));
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
*/

    axios(config)
    .then(function (response) {
      
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });


