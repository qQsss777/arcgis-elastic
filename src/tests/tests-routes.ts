import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { server } from "../index";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

export const testsRoutes = () => {
    describe("Search", () => {
        describe("GET /deplacements/search", () => {
            it("should be a success", (done) => {
                chai.request(server)
                    .get("/deplacements/search")
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });
    });
    describe("Add", () => {
        describe("POST /deplacements/add", () => {
            it("should be a success for post", (done) => {
                chai.request(server)
                    .post("/deplacements/add")
                    .send({})
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                    });
            });

        });
    });

    describe("404", () => {
        describe("GET & POST to 404", () => {
            it("should be a fail", (done) => {
                chai.request(server)
                    .get("/44")
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });
    });

};