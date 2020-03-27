import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { server } from "../../index";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

export const testsRoutesGeojson = () => {
    describe("GET /capteurs/geojson", () => {
        it("should be a success", (done) => {
            chai.request(server)
                .get("/capteurs/geojson")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("GET /capteurs/geojson?", () => {
        it("should be a success", (done) => {
            chai.request(server)
                .get("/capteurs/geojson?")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("GET /yapasdindex/geojson", () => {
        it("should be a fail", (done) => {
            chai.request(server)
                .get("/yapasdindex/geojson")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    /*
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
*/
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