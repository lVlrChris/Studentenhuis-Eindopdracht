
const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const mocha = require('mocha');
const expect = chai.expect;
const should = chai.should();
const auth = require('../auth/authentication');

chai.should();
chai.use(chaiHttp);

describe('Deelnemer API POST', () => {
    // it('should throw an error when using invalid JWT token', (done) => {
    //     //
    //     // Hier schrijf je jouw testcase.
    //     //
    //     done()
    // });

    it('should return an error when posting an invalid huisID', (done) => {
        chai.request(index)
            .post("/api/studentenhuis/9999/maaltijd/1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(404);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when posting an invalid maaltijdId', (done) => {
        chai.request(index)
            .post("/api/studentenhuis/1/maaltijd/9999/deelnemers")
            .send()
            .end((err, res) =>  {
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });
});

describe('Deelnemer API GET', () => {
    it('should return an array of deelnemers when valid info is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/1/maaltijd/1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(200);
            });
        done()
    });

    it('should return an error when an invalid huisId is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/1000000/maaltijd/1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(404);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when an invalid maaltijdId is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/1/maaltijd/9999/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(404);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when a negative maaltijdId is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/1/maaltijd/-1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(412);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when a negative huisId is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/-1/maaltijd/1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(412);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when a decimal huisId is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/0.1/maaltijd/1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(412);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when a decimal maaltijdId is provided', (done) => {
        chai.request(index)
            .get("/api/studentenhuis/1/maaltijd/0.1/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(412);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });
});

describe('Maaltijd API DELETE', () => {
    it('should return an error when provided an invalid huisId', (done) => {
        chai.request(index)
            .delete("/api/studentenhuis/9999/maaltijd/30/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(404);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when provided an invalid maaltijdId', (done) => {
        chai.request(index)
            .delete("/api/studentenhuis/1/maaltijd/9999/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(404);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });

    it('should return an error when provided a negative huisId', (done) => {
        chai.request(index)
            .delete("/api/studentenhuis/-1/maaltijd/20/deelnemers")
            .send()
            .end((err, res) =>  {
                res.should.have.status(412);
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("datetime");
            });
        done()
    });
});