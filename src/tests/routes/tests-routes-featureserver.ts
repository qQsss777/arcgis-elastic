import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { server } from "../../index";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

export const testsRoutesFeatureServer = () => {

    describe("GET /capteurs/featureserver", () => {
        it("should be a fail because no route", (done) => {
            chai.request(server)
                .get("/capteurs/featureserver")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe("GET /capteurs/featureserver/0", () => {
        it("should be a success", (done) => {
            chai.request(server)
                .get("/capteurs/featureserver/0")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
    describe("GET /capteurs/featureserver/0/query?", () => {
        it("should be a success", (done) => {
            chai.request(server)
                .get("/capteurs/featureserver/0/query?")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

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
};