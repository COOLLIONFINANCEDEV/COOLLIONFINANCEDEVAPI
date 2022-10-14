const BaseService = require("./service.js");
const Serializer = require('../serializers/serializer.js');

const TABLE = "user";

class User extends BaseService {
    constructor(model, table) {
        super(model, table);

        this.first_name;
        this.last_name;
        this.email;
        this.address;
        this.country;
        this.password;
    }

    loadModel(user) {
        return Serializer.normalize({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            address: user.address,
            country: user.country,
            password: user.password,
            salt: user.salt
        }, ['password', 'salt'])
    }
}


module.exports = User;