
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { server } from "../../index";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

export const testsSchemaGeojson = () => {
    describe("POST /deplacements/add", () => {
        it("should be a success for obj geom", (done) => {
            chai.request(server)
                .post("/polyline/add")
                .send({
                    "deplacementxy": {
                        "type": "multilinestring",
                        "coordinates": [
                            [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0]],
                            [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0]],
                            [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [0, 0.8]]
                        ]
                    },
                    "prenom": "Marc",
                    "nom": "Le Moigne",
                    "email": "mlm@demoESArcGIS.fr",
                    "rattachement": "Meudon",
                    "deplacement": "Brest",
                    "date": "2020-04-25"
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.include({ state: true });
                    done();
                });
        });

        it("should be a success for polygon geojson", (done) => {
            chai.request(server)
                .post("/polygon/add")
                .send({
                    "attributes": {
                        "prenom": "Marc",
                        "nom": "Le Moigne",
                        "email": "mlm@demoESArcGIS.fr",
                        "rattachement": "Meudon",
                        "deplacement": "Brest",
                        "date": "2020-04-25"
                    },
                    "geometry": {
                        "type": "polygon",
                        "coordinates": [
                            [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
                        ]
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.include({ state: true });
                    done();
                });
        });

        it("should be a success for esri feature API", (done) => {
            chai.request(server)
                .post("/deplacements/add")
                .send({
                    "geometry": { "x": -118.15, "y": 33.80 },
                    "attributes": {
                        "prenom": "Marc",
                        "nom": "Le Moigne",
                        "email": "mlm@demoESArcGIS.fr",
                        "rattachement": "Meudon",
                        "deplacement": "Brest",
                        "date": "2020-04-25"
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.include({ state: true });
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
                    expect(res.body).to.deep.include({ state: true });
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
                    expect(res.body).to.deep.include({ state: false });
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
                    expect(res.body).to.deep.include({ state: false });
                    done();
                });
        });
    });
};
