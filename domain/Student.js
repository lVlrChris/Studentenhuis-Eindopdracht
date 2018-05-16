class Person {

    constructor(firstName, lastName, email, password) {
        //TODO: Give this the corresponding db ID (use setID after db insert).
        this.id = 99;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;

        //Callback valid data
        if (this.email !== "" | this.password !== "") {
            console.log("Student has valid data");
            this.isValid = true;
        } else {
            console.log("Student has invalid data");
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