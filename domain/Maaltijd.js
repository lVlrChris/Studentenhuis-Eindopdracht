class Maaltijd {

    constructor(naam, beschrijving, ingredienten, allergie, prijs) {
        this.naam = naam;
        this.beschrijving = beschrijving;
        this.ingredienten = ingredienten;
        this.allergie = allergie;
        this.prijs = prijs;

        //TODO: Validation (assert)
    }

    setId(id) {
        this.id = id;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    setHuisId(huisId) {
        this.huisId = huisId;
    }
}

module.exports = Maaltijd;