const ApiError = require ("../domain/ApiError");

function validateEmail(email) {
    const validator = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validator.test(email);
}

class Person {

    constructor(firstName, lastName, email, password) {

        try {
            assert(typeof (firstName) === "string", "firstName must be a string");
            assert(typeof (lastName) === "string", "lastName must be a string");
            assert(typeof (email) === "string", "email must be a string");
            assert(typeof (password) === "string", "password must be a string");
            assert(firstName.trim().length > 2, "firstName must be at least 3 characters");
            assert(lastName.trim().length > 2, "lastName must be at least 3 characters");
            assert(firstName.trim().length > 2, "firstName must be at least 3 characters");
            assert(validateEmail(email.trim()), "email must be a valid email adresss");
            assert(password.trim().length > 2, "password must be at least 3 characters");

        } catch (ex) {
            throw(new ApiError(ex.toString(), 422));
        }

        this.name = {
            firstName: firstName.trim(),
            lastName: lastName.trim()
        };
        this.email = email;
        //TODO: encrypt.
        this.password = password;
    }
    //
    // getValidation() {
    //     return this.isValid;
    // }

    setID(id) {
        this.id = id;
    }
}

module.exports = Person;