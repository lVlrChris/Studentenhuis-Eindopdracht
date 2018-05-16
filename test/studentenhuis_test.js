
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

chai.should()
chai.use(chaiHttp)

let validToken

describe('Studentenhuis API POST', () => {

    before(function () {
        chai.request(server)
            .get("/api/login")
            .send({
                "email":"test@hotmail.com",
                "password": "welkom1"
            })
            .end((err, res) => {
                validToken = res.body.token
            })
    })
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .set("X-Access-token", 1)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                validToken = res.body.token
                done()
            })
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .set("X-Access-token", validToken)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                validToken = res.body.token
                res.should.have.status(200)
                done()
            })
    })

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .set("X-Access-token", validToken)
            .send({
                "naam": "",
                "adres": "testadres"
            })
            .end((err, res) => {
                validToken = res.body.token
                res.should.have.status(200)
                done()
            })
    })

        it('should throw an error when adres is missing', (done) => {
            chai.request(server)
                .post("/api/studentenhuis")
                .set("X-Access-token", validToken)
                .send({
                    "naam": "testhuis",
                    "adres": ""
                })
                .end((err, res) => {
                    validToken = res.body.token
                    res.should.have.status(200)
                    done()
                })
        })
    })

describe('Studentenhuis API GET all', () => {
            before(function () {
                chai.request(server)
                    .get("/api/login")
                    .end((err, res) => {
                        validToken = res.body.token
                    })
            })

            it('should throw an error when using invalid JWT token', (done) => {
                chai.request(server)
                    .post("/api/studentenhuis")
                    .set("X-Access-token", 1)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })

            it('should return all studentenhuizen when using a valid token', (done) => {
                chai.request(server)
                    .post("/api/studentenhuis")
                    .set("X-Access-token", validToken)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
        })


describe('Studentenhuis API GET one', () => {
    before(function () {
        chai.request(server)
            .get("/api/login")
            .send({
                "email":"test@hotmail.com",
                "password": "welkom1"
            })
            .end((err, res) => {
                validToken = res.body.token
            })
    })
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .set("X-Access-token", 1)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return an error when using an non-existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})

describe('Studentenhuis API PUT', () => {
    before(function () {
        chai.request(server)
            .put("/api/login")
            .send({
                "email":"test@hotmail.com",
                "password": "welkom1"
            })
            .end((err, res) => {
                validToken = res.body.token
            })
    })
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .put("/api/studentenhuis")
            .set("X-Access-token", 1)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        chai.request(server)
            .put("/api/studentenhuis")
            .set("X-Access-token", validToken)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
        done()
    })

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .put("/api/studentenhuis")
            .set("X-Access-token", validToken)
            .send({
                "naam" : "",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
        done()
    })

    it('should throw an error when adres is missing', (done) => {
        chai.request(server)
            .put("/api/studentenhuis")
            .set("X-Access-token", 1)
            .send({
                "naam" : "testhuis",
                "adres": ""
            })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
})

describe('Studentenhuis API DELETE', () => {
    before(function () {
        chai.request(server)
            .get("/api/login")
            .send({
                "email":"test@hotmail.com",
                "password": "welkom1"
            })
            .end((err, res) => {
                validToken = res.body.token
            })
    })
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .del("X-Access-token", 1)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .del("X-Access-token", validToken)
            .send({
                "naam" : "testhuis",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .del("X-Access-token", validToken)
            .send({
                "naam" : "",
                "adres": "testadres"
            })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })

    it('should throw an error when adres is missing', (done) => {
        chai.request(server)
            .post("/api/studentenhuis")
            .del("X-Access-token", validToken)
            .send({
                "naam" : "testhuis",
                "adres": ""
            })
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
})