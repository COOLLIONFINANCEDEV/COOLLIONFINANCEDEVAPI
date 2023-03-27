// import Joi from "@hapi/joi";


// const test = [1, 2, 3];
// const [, val2] = test;
// const [val1,] = test;
// console.log(val2, val1);

// const test2: (number | number[])[][] = [[1, [1, 2, 3, 4, 5]], [1, [1, 5, 6, 7, 8]]];
// const mySet = new Set<number>();

// test2.forEach(([, perms]) => {
//     for (const item of perms as number[]) {
//         mySet.add(item);
//     }
// });
// console.log(mySet);
// console.log([...mySet]);

// const mySet2 = new Set([1, 2, 3, 4, 5]);
// const myArray = [1, 2, 3, 4, 5, 6];
// for (const item of myArray) {
//     mySet2.add(item);
// }
// console.log(mySet2);
// const [val3, val4, ...val5] = myArray;

// console.log(val3, val4, val5);

// console.log(Math.floor(Math.random() * -1000));

// const schema = Joi.object({
//     name: Joi.string()
//         .alphanum()
//         .min(3)
//         .max(30)
//         .required(),
//     description: Joi.string(),
//     permissions: Joi.array().items(
//         Joi.number().integer().required(),
//         Joi.number().integer().required()).required(),
//     published: Joi.boolean().default(true),
// });

// console.log(schema.validate({
//     name: "moderator",
//     permissions: ["5", 6],
// }));

// function t(arg: number) {
//     arg = arg || 28;
//     return arg;
// }
// console.log(t(NaN));


// const arg = { subject: "User", action: undefined };

// const { subject, action = "h" } = arg;
// console.log(subject, action);

// const schema2 = Joi.object({
//     methods: Joi.array().items(
//         Joi.object({
//             name: Joi.string().required(),
//             phone: Joi.string().required(),
//         }).required()
//     ).required()
// });

// console.log(schema2.validate({
//     methods: [
//         {
//             name: "8",
//             phone: "8"
//         }
//     ]
// }));



// const isBelowThreshold = (currentValue: any) => {
//     console.log(currentValue);
//     return currentValue.every((val: number) => {
//         console.log(val);
//         return val < 40
//     })
// };

// const array1 = [[1, 30], [39, 29], [10, 13]];

// console.log(array1.every(isBelowThreshold));

// function addMonthsToDate(date: Date, months: number): Date {
//     const newDate = new Date(date.getTime());
//     newDate.setMonth(newDate.getMonth() + months);
//     return newDate;
// }

// // Exemple d'utilisation
// const date = new Date(); // Date actuelle
// const newDate = addMonthsToDate(date, 10); // Ajouter 6 mois à la date actuelle
// console.log(newDate);

// console.log(Boolean("0"))

// const otherId = undefined;
// const tenantId = 8;

// const obj = {
//     id: Number(otherId) || tenantId
// }

// console.log(obj);

// const schema3 = Joi.object({
//     emails: Joi.array().items(
//         {
//             email: Joi.string().email().required(),
//             roleId: Joi.number().integer().required(),
//         }
//     ).required(),
// });

// console.log(schema3.validate({
//     emails: [{
//         email: "hello@example.com",
//         roleId: 4
//     }]
// }));



// // const array = [
// //     {
// //         userId: 1,
// //         tenantId: 1,
// //         role: {
// //             name: "admin",
// //         }
// //     },
// //     {
// //         userId: 2,
// //         tenantId: 1,
// //         role: {
// //             name: "comptable",
// //         }
// //     },
// //     {
// //         userId: 2,
// //         tenantId: 1,
// //         role: {
// //             name: "developer",
// //         }
// //     },
// //     {
// //         userId: 3,
// //         tenantId: 1,
// //         role: {
// //             name: "developer",
// //         }
// //     },
// //     {
// //         userId: 2,
// //         tenantId: 1,
// //         role: {
// //             name: "PM",
// //         }
// //     },
// // ]

// // const group = groupBy(array, (v: any) => v.userId);

// const text = "I Love Code!";
// const encodedText = Buffer.from(text).toString("base64url");
// console.log(encodedText);
// const decodedText = Buffer.from("t243y4tujy5km" + encodedText + "grjvkjwthlejyrku", 'base64url').toString("utf8");
// console.log(decodedText);


// const base64url = 'aHR0cHM6Ly93d3cueW91dHViZS5jb20=';

// // Step 1: Replace '-' with '+' and '_' with '/'
// let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

// // Step 2: Add padding characters if necessary
// // const padding = base64.length % 4;
// // if (padding) {
// //     base64 += '='.repeat(4 - padding);
// // }

// // Step 3: Decode the base64 string
// const decoded = Buffer.from(base64, 'base64').toString('utf-8');

// console.log(decoded); // Output: https://www.youtube.com




// console.log("I think coding is so good!".replace(/ /, ""));




