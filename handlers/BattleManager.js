class BattleManager {
    constructor(logRenderer) {
        this.logRenderer = logRenderer;
    }

    initiateBattle(player, monsters, card) {
        this.logRenderer.addMessage(player.name  + " kämpft gegen " + monsters[0].name + " (" + monsters[0].hitPoints + ")");
        this.displayBattleDialog(player, monsters, card);
    }

    displayBattleDialog(player, monsters, card) {
        // Hier würden Sie den Dialog mit dem "Würfeln"-Knopf anzeigen.
        // Dieser Abschnitt ist pseudocodeartig, da die spezifische Umsetzung stark von Ihrem UI-Framework abhängt.

        // Beispielsweise:
        // Zeige Kampf-Dialog
        // Warte auf "Würfeln"-Knopfdruck

        // Wenn "Würfeln"-Knopf gedrückt:
        const playerRoll = this.rollDice() + this.rollDice(); // Zwei Würfel werfen
        this.logRenderer.addMessage(player.name + " würfelt eine " + playerRoll);
        const monster = monsters[0]; // Nehmen wir das erste Monster für den Kampf.

        // Füge die Würfelergebnisse zu den Hitpoints des Spielers hinzu
        const playerHitPoints = playerRoll + player.hitPoints;

        // Vergleiche Hitpoints und entscheide, wer gewonnen hat
        if (playerHitPoints > monster.hitPoints) {
            // Der Spieler gewinnt
            this.playerWins(player, monster, card);
        } else if (playerHitPoints == monster.hitPoints) {
            this.noWinner(player, monster)
        } else
        {
            // Das Monster gewinnt
            this.monsterWins(player, monster);
        }
    }

    rollDice() {
        // Gibt eine Zufallszahl zwischen 1 und 6 zurück
        return Math.floor(Math.random() * 6) + 1;
    }

    playerWins(player, monster, card) {
        // Implementieren Sie die Logik, die ausgeführt wird, wenn der Spieler gewinnt.
        // Zum Beispiel: Monster von der Karte entfernen, Spieler belohnen, etc.
        this.logRenderer.addMessage(player.name + " gewinnt gegen " + monster.name + " (" + monster.hitPoints + ")" + "!");
        card.removeMonster(monster.id);
        this.logRenderer.addMessage(player.name + " nimmt " + monster.treasure.name + " auf.");   
        player.addTreasure(monster.treasure)
    }

    monsterWins(player, monster) {
        // Implementieren Sie die Logik, die ausgeführt wird, wenn das Monster gewinnt.
        // Zum Beispiel: Spieler-Strafen, Rückkehr zum letzten Speicherpunkt, etc.
        this.logRenderer.addMessage(player.name + " verliert gegen " + monster.name + " (" + monster.hitPoints + ")");
        this.logRenderer.addMessage(player.name + " verliert einen Lebenspunkt.");   
        player.healthPoints = player.healthPoints -1;
    }

    noWinner(player, monster){
        this.logRenderer.addMessage("Kampf mit " + monster.name + " (" + monster.hitPoints + ")" + " endet unentschieden.");
    }
}

// World MANAGER