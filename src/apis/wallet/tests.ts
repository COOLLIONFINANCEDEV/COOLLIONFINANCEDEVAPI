import supertest from 'supertest';
import app from 'src/app';
import { endpoints } from 'src/config';
import resolve_route from 'src/helpers/resolve_route';

const usersEndpoints = endpoints.users;
const rr = resolve_route;

function user_tests() {
    supertest(app)
        .get(rr(usersEndpoints.list))
        .expect(200)
        .end(function (err, res) {
            console.log(err);
        });
}

export default user_tests;

