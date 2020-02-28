
"use strict";
// Import the dependencies for testing
let chai = require("chai");
let chaiHttp = require("chai-http");
let { server } = require("../index");
const expect = chai.expect;

const testsSchema = () => {
    // Configure chai
    chai.use(chaiHttp);
    chai.should();

    describe("Add", () => {
        describe("POST /deplacements/add", () => {

            it("should be a success for obj geom", (done) => {
                chai.request(server)
                    .post("/deplacements/add")
                    .send({
                        prenom: "Marc",
                        nom: "Le Moigne",
                        email: "mlm@demoESArcGIS.fr",
                        rattachement: "Meudon",
                        deplacement: "Brest",
                        deplacementxy:
                        {
                            lat: 48.3959645,
                            lon: -4.5048381
                        },
                        date: "2020-04-25"
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body).to.deep.include({ state: "success" });
                        done();
                    });
            });

            it("should be a success for array geom", (done) => {
                chai.request(server)
                    .post("/deplacements/add")
                    .send({
                        date: "2020-04-25",
                        deplacement: "Brest",
                        deplacementxy: [1, 3],
                        email: "mlm@demoESArcGIS.fr",
                        nom: "Le Moigne",
                        prenom: "Marc",
                        rattachement: "Meudon"
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body).to.deep.include({ state: "success" });
                        done();
                    });
            });

            it("should be a fail for missing fields", (done) => {
                chai.request(server)
                    .post("/deplacements/add")
                    .send({
                        date: "2020-04-25",
                        deplacement: "Brest",
                        deplacementxy: "ffefe",
                        email: "mlm@demoESArcGIS.fr",
                        nom: "Le Moigne"
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body).to.deep.include({ state: "failed" });
                        done();
                    });
            });

            it("should be a fail for a new property", (done) => {
                chai.request(server)
                    .post("/deplacements/add")
                    .send({
                        date: "2020-04-25",
                        deplacement: "Brest",
                        deplacementxy: "ffefe",
                        email: "mlm@demoESArcGIS.fr",
                        nom: "Le Moigne",
                        prenom: "Marc",
                        rattachement: "Meudon",
                        newpropertie: 1234
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body).to.deep.include({ state: "failed" });
                        done();
                    });
            });
        });
    });
};

module.exports = testsSchema;