class Card {
    constructor(id, openSides, cardType, battleCallback = null) {
        this.id = id;
        this.openSides = openSides; // z.B. {top: true, right: false, bottom: true, left: true}
        this.cardType = cardType; // z.B. "Heilpunkt" 
        this.players = []; // Spieler auf der Karte
        this.monsters = []; // Monster auf der Karte
        this.battleCallback = battleCallback;
    }

    addPlayer(player) {
        this.players.push(player);
        if (this.monsters.length > 0 && this.battleCallback) {
            this.battleCallback(player, this.monsters, this);
        }
        if (this.cardType == "Heilungsraum") {
            player.restoreHealth();
        }
    }

    addBattleCallback(battleCallback){
        this.battleCallback = battleCallback;
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    addMonster(monster) {
        this.monsters.push(monster);
    }

    removeMonster(monsterId) {
        this.monsters = this.monsters.filter(monster => monster.id !== monsterId);
    }

}
