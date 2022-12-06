import axios from "axios";


async function test() {
    try {
        const response = await axios.get("https://api.coollionfi.com/");
        console.log(response);
        return response;
    } catch (reason) {
        return reason;
    }
}


const result = test();

console.log(result);

async function result2(): Promise<unknown> {
    return await test();
}

console.log(result2());

