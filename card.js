class Card {
    constructor(id, openSides, special) {
        this.id = id;
        this.openSides = openSides; // z.B. {top: true, right: false, bottom: true, left: true}
        this.special = special; // z.B. "Heilpunkt" 
        this.players = []; // Spieler auf der Karte
        this.monsters = []; // Monster auf der Karte
    }

    addPlayer(player) {
        // player könnte ein Objekt mit Spielerdetails sein
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    addMonster(monster) {
        // monster könnte ein Objekt mit Monsterdetails sein
        this.monsters.push(monster);
    }

    removeMonster(monsterId) {
        this.monsters = this.monsters.filter(monster => monster.id !== monsterId);
    }

}
