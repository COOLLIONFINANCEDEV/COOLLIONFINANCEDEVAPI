import supertest from 'supertest';
import app from 'src/app';
import { endpoints } from 'src/config';
import resolve_route from 'src/helpers/resolve_route';

const offersEndpoints = endpoints.offer;
const rr = resolve_route;

function offer_tests() {
    supertest(app)
        .get(rr(offersEndpoints.list))
        .expect(200)
        .end(function (err, res) {
            console.log(err);
        });
}

export default offer_tests;

