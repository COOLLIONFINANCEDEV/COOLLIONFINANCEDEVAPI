import Joi from "@hapi/joi";
import debug from "debug";

const logger = debug("test");

const schema = Joi.object({
    username: Joi.string(),
    password: Joi.string(),
    address: Joi.string(),
    magicLink: Joi.string().uri(),
})
    .with("username", "password")
    .xor("username", "address", "magicLink");

const result = schema.validate({ magicLink: "https://example.com?magicLink=token" });
logger("%O", result);
