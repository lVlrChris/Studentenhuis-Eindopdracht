const Student = require ("../domain/Student");
const assert = require ("assert");

describe("Person", () => {

    it("Should be initiated successfully with valid data.", (done) => {

        const student = new Student("abc", "def", "abc@email.com", "password");

        assert(typeof (student.name) === "object", "Student should have an name object.");

        assert(typeof (student.name.firstName) === "string", "Student should have a firstName that is a string");
        assert(deepEqual(student.name.firstName, "abc"), "Should have \"abc\" as firstName");
        assert(typeof (student.name.lastName) === "string", "Student should have a lastName that is a string");
        assert(deepEqual(student.name.lastName, "def"), "Should have \"def\" as lastName");
        assert(typeof (student.email) === "string", "Student should have a email that is a string");
        assert(deepEqual(student.email, "abc@email.com"), "Student should have \"abc@email.com\" as email");
        //assert(typeof (student.password) === "string", "Student should have a password that is a string");
        //assert(deepEqual(student.password, "password"), "Student should have \"password\" as password");

        done();
    });

    it("Should not accept a firstName shorter than 3 characters", (done) => {

        assert.throws(() => new Student("ab", "def", "abc@email.com", "password"));
        done();
    });

    it('should not accept a lastname shorter than 3 characters', (done) => {

        assert.throws(() => new Student("abc", "de", "abc@email.com", "password"));
        done()
    });

    it('should not accept an invalid email adress', (done) => {

        assert.throws(() => new Student("abc", "def", "abc@email", "password"));
        done();
    });

    it('should not accept a password shorter than 3 characters', (done) => {

        assert.throws(() => new Student("abc", "def", "abc@email.com", "pa"));
        done();
    });

    it('should accept exactly four arguments', (done) => {
        assert.throws(() => new Student());
        assert.throws(() => new Student(''));
        assert.throws(() => new Student('', ''));
        assert.throws(() => new Student('', '', ''));
        assert.throws(() => new Student('', '', '', '', ''));
        done();
    });

    it('should accept only strings as arguments', (done) => {
        assert.throws(() => new Student(1, 2, 3, 4));
        assert.throws(() => new Student({}, {}, {}, {}));
        assert.throws(() => new Student([], [], [], []));
        assert.throws(() => new Student(true, true, true, true));
        done()
    });


})