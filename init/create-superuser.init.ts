// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/create-superuser.init.ts\"
/**
 * GENERATE
 */

import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




const questions = [
    {
        name: "email",
        question: "email: ",
    },
    {
        name: "phone",
        question: "phone (optional): ",
        optional: true,
    },
    {
        name: "password",
        question: "password: ",
        hideInput: true,
    }
]

const [email, phone, password] = questions;

rl.question(email.question, (answer) => {
    if (!answer) {
        console.log(`chalk`)
    }
});