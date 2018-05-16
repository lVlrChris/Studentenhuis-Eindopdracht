
const db = require("../datasource/db");
const chai = require('chai')
const chaiHttp = require('chai-http')
const index = require('../index')
let should = chai.should();
let expect = chai.expect;
chai.should()
chai.use(chaiHttp)

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken;
let firstname = "samuel";
let lastname = "rafini";
let email = "samuel@email.com";
let password = "qwerty"

let registerCredentials = {
    "firstname"     :   firstname,
    "lastname"      :   lastname,
    "email"         :   email,
    "password"      :   password
}

let loginCredentials = {
    "email"     :   "samuel@email.com",
    "password"  :   "qwerty"
}


describe('Registration', () => {

    //Voordat hij alle tests gaat uitvoeren moet hij dit eerst uitvoeren
    before(function()   {
        var query = {
            sql: "INSERT INTO `user` (Voornaam, Achternaam, Email, Password)" +
                "VALUES " +
                "(\'" + firstname + "\'," +
                "\'" + lastname + "\'," +
                "\'" + email + "\'," +
                "\'" + password + "\');",
            timeout: 2000
        }

        db.query(query, function(err, rows) {
            if(err) {
                console.log("There was an error. \r\n" + err);
                
            } else  {
                console.log("Added user with email "+email+" to the db");
                
            }
        })
    });


    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //

        // Tip: deze test levert een token op. Dat token gebruik je in 
        // andere testcases voor beveiligde routes door het hier te exporteren
        // en in andere testcases te importeren via require.
        // validToken = res.body.token
        // module.exports = {
        //     token: validToken
        // }
        chai.request(index)
        .post("/api/login")
        .send(loginCredentials)
        .end((err, res) =>  {
            res.should.have.status(200);
            res.body.should.have.property("token")
            expect(res.body.token).to.be.a("string");
            validToken = res.body.token;            
        })      

        done()
    })

    it('should return an error on GET request', (done) => {

        chai.request(index)
        .get("/api/login")
        .set("x-access-token", validToken)
        .end((err, res) =>  {
            res.should.have.status(404);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })
        done()
    })

    it('should throw an error when the user already exists', (done) => {

        chai.request(index)
        .post("api/register")
        .send(registerCredentials)
        .end((err, res)  =>  {
            res.should.have.status(401);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

    it('should throw an error when no firstname is provided', (done) => {
        
        var editedRegisterCredentials = {
            "firstname"     :   "",
            "lastname"      :   "samuel",
            "email"         :   "samuel@email.com",
            "password"      :   "qwert"
        }

        chai.request(index)
        .post("api/register")
        .send(editedRegisterCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        
        var editedRegisterCredentials = {
            "firstname"     :   "A",
            "lastname"      :   "samuel",
            "email"         :   "rafini@email.com",
            "password"      :   "qwerty"
        }

        chai.request(index)
        .post("api/register")
        .send(editedRegisterCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

    it('should throw an error when no lastname is provided', (done) => {
        
        var editedRegisterCredentials = {
            "firstname"     :   "samuel",
            "lastname"      :   "",
            "email"         :   "samuel@email.com",
            "password"      :   "qwerty"
        }

        chai.request(index)
        .post("api/register")
        .send(editedRegisterCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

    it('should throw an error when lastname is shorter than 2 chars', (done) => {

        var editedRegisterCredentials = {
            "firstname"     :   "samuel",
            "lastname"      :   "r",
            "email"         :   "samuel@email.com",
            "password"      :   "qwerty"
        }

        chai.request(index)
        .post("api/register")
        .send(editedRegisterCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

    it('should throw an error when email is invalid', (done) => {

        var editedRegisterCredentials = {
            "firstname"     :   "samuel",
            "lastname"      :   "rafini",
            "email"         :   "hecj090d--d",
            "password"      :   "qwerty"
        }

        chai.request(index)
        .post("api/register")
        .send(editedRegisterCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

})

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {

        chai.request(index)
        .post("/api/login")
        .send(loginCredentials)
        .end((err, res) =>  {
            res.should.have.status(200);
            res.body.should.have.property("token")
            expect(res.body.token).to.be.a("string");
            validToken = res.body.token;            
        })  

        done()
    })

    it('should throw an error when email does not exist', (done) => {

        var editedLoginCredentials = {
            "email" :   "niu094--",
            "password"  :   "qwerty"
        }

        chai.request(index)
        .post("/api/login")
        .send(editedLoginCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })

    it('should throw an error when email exists but password is invalid', (done) => {

        var editedLoginCredentials = {
            "email" :   "samuel@email.com",
            "password"  :   "qwerty"
        }

        chai.request(index)
        .post("/api/login")
        .send(editedLoginCredentials)
        .end((err, res) =>  {
            res.should.have.status(412);
            res.body.should.have.property("message");
            res.body.should.have.property("code");
            res.body.should.have.property("datetime");
        })

        done()
    })
})

module.exports = {
    validToken
}