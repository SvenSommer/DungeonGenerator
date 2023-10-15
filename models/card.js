class Card {
    constructor(id, openSides, specialProperty) {
      this.id = id;
      this.openSides = openSides; // z.B. {top: true, right: false, bottom: true, left: false}
      this.specialProperty = specialProperty; // z.B. "Heilpunkt" oder "Monsterraum"
    }
  }