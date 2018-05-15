class Person {

    constructor(firstName, lastName, email, password) {
        //TODO: Give this the corresponding db ID (use setID after db insert).
        this.id = 3;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;

        //Callback valid data
        if (this.email !== "" | this.password !== "") {
            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    getValidation() {
        return this.isValid;
    }

    setID(id) {
        this.id = id;
    }
}

module.exports = Person;