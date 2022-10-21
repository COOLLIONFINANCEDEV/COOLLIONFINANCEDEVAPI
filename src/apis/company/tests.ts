import supertest from 'supertest';
import app from 'src/app';
import { endpoints } from 'src/config';
import resolve_route from 'src/helpers/resolve_route';

const companiesEndpoints = endpoints.company;
const rr = resolve_route;

function company_tests() {
    supertest(app)
        .get(rr(companiesEndpoints.list))
        .expect(200)
        .end(function (err, res) {
            console.log(err);
        });
}

export default company_tests;

