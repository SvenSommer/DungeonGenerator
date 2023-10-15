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
            console.log("Kampf trigger!")
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

class Treasure {
    constructor(name,hitPoints, weapon, healing){
        this.name = name;
        this.hitPoints = hitPoints;
        this.weapon = weapon;
        this.healing = healing; 
    }
}


class Player {
    constructor(id, name, healthPoints, hitPoints, maxSteps, x, y) {
        this.id = id;
        this.name = name;
        this.healthPoints = healthPoints
        this.hitPoints = hitPoints;
        this.maxSteps = maxSteps
        this.treasure = [];
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        // Weitere Eigenschaften...
    }
    addTreasure(treasure) {
        this.treasure.push(treasure)
        if (treasure.weapon)
        this.hitPoints += treasure.hitPoints;
    }
}

class Monster {
    constructor(id, name, hitPoints, treasure, x, y) {
        this.id = id;
        this.name = name;
        this.hitPoints = hitPoints;
        this.treasure = treasure;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        // Weitere Eigenschaften...
    }
    // Methoden...
}

class BattleManager {
    initiateBattle(player, monsters, card) {
        console.log("Kampf started! Player", player, "monsters", monsters)
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
        console.log("playerRoll", playerRoll)
        const monster = monsters[0]; // Nehmen wir das erste Monster für den Kampf.

        // Füge die Würfelergebnisse zu den Hitpoints des Spielers hinzu
        const playerHitPoints = playerRoll + player.hitPoints;

        // Vergleiche Hitpoints und entscheide, wer gewonnen hat
        if (playerHitPoints > monster.hitPoints) {
            // Der Spieler gewinnt
            this.playerWins(player, monster, card);
        } else {
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
        console.log("Spieler gewinnt!")
        card.removeMonster(monster.id);
        player.addTreasure(monster.treasure)
    }

    monsterWins(player, monster) {
        // Implementieren Sie die Logik, die ausgeführt wird, wenn das Monster gewinnt.
        // Zum Beispiel: Spieler-Strafen, Rückkehr zum letzten Speicherpunkt, etc.
        console.log("Monster gewinnt!")
        player.healthPoints = player.healthPoints -1;
    }
}

// CARD MANAGER
class CardManager {
    constructor(cardFactory, cardRenderer) {
        this.cardFactory = cardFactory;
        this.cardRenderer = cardRenderer;
        this.placedCards = [];
    }

    createRandomCard(type = null, minOpenSides = null) {
        return this.cardFactory.createRandomCard(type, minOpenSides);
    }

    isNewCardPlacementValid(x, y, cardX, cardY, cardSize, doorClickThreshold, openSides) {
        const isInsideCardBounds = x > cardX && x < cardX + cardSize && y > cardY && y < cardY + cardSize;
        if (!isInsideCardBounds) return false;

        if (y < cardY + doorClickThreshold && openSides.top) {
            this.placeNewCard(cardX, cardY - cardSize);
            return true;
        }
        if (y > cardY + cardSize - doorClickThreshold && openSides.bottom) {
            this.placeNewCard(cardX, cardY + cardSize);
            return true;
        }
        if (x > cardX + cardSize - doorClickThreshold && openSides.right) {
            this.placeNewCard(cardX + cardSize, cardY);
            return true;
        }
        if (x < cardX + doorClickThreshold && openSides.left) {
            this.placeNewCard(cardX - cardSize, cardY);
            return true;
        }
        return false;
    }

    newCardEvent(x, y) {
        this.placedCards.forEach(placedCard => {
            const { x: cardX, y: cardY, card } = placedCard;
            const { cardSize, doorClickThreshold } = this.cardRenderer;
            const { openSides } = card;

            this.isNewCardPlacementValid(x, y, cardX, cardY, cardSize, doorClickThreshold, openSides);
        });
    }

    placeNewCard(x, y, type = null, minOpenSides = null) {
        const maxAttempts = 100;
        let attempts = 0;
        let newCard;

        do {
            newCard = this.createRandomCard(type, minOpenSides);
            attempts++;
            if (attempts >= maxAttempts) {
                console.error("Max attempts reached, no matching card found");
                return;
            }
        } while (!this.cardFitsAt(x, y, newCard) && this.placedCards.length !== 0);

        this.placedCards.push({ card: newCard, x, y });
        this.drawAllCards();
    }

    addPlayer(x, y, player) {
        const card = this.findCardAt(x, y);

        if (!card) {
            console.error(`No card found at position (${x}, ${y})`);
            return;
        }

        card.card.addPlayer(player, x, y);

        this.drawAllCards();
    }

    getPlayerAtPosition(x, y) {
        for (const placedCard of this.placedCards) {
            const { card, x: cardX, y: cardY } = placedCard;
            const { cardSize } = this.cardRenderer;


            // Prüfe, ob ein Spieler auf der Karte steht
            for (const player of card.players) {
                // Annahme, dass Spieler-Objekte eine x und y Eigenschaft haben, die ihre Position auf der Karte angibt
                // und eine width und height Eigenschaft, die ihre Größe bestimmen.
                if (
                    x >= cardX + player.x &&
                    x <= cardX + player.x + player.width &&
                    y >= cardY + player.y &&
                    y <= cardY + player.y + player.height
                ) {
                    return player;
                }
            }

        }
        // Wenn keine passenden Spieler gefunden wurden, geben null zurück
        return null;
    }

    placePlayerAtNewPosition(player, x, y) {
        const { cardSize } = this.cardRenderer;
        for (const placedCard of this.placedCards) {
            const { x: cardX, y: cardY, card: newCard } = placedCard;
            if (x >= cardX && x <= cardX + cardSize && y >= cardY && y <= cardY + cardSize) {
                const currentCard = this.findCardByPlayerId(player.id);
                if (currentCard) {
                    currentCard.card.removePlayer(player.id);
                }
                player.x = x - cardX;
                player.y = y - cardY;
                newCard.addPlayer(player);
                return true;
            }
        }
        return false;
    }

    findCardByPlayerId(playerId) {
        // Finde die Karte, auf der sich der Spieler befindet
        return this.placedCards.find(placedCard =>
            placedCard.card.players.some(player => player.id === playerId)
        );
    }

    findCardAt(x, y) {
        return this.placedCards.find(placedCard =>
            placedCard.x === x && placedCard.y === y
        );
    }

    cardFitsAt(x, y, card) {
        const cardSize = this.cardRenderer.cardSize;

        const hasCollision = this.placedCards.some(placedCard => placedCard.x === x && placedCard.y === y);
        if (hasCollision) return false;

        return this.placedCards.some(placedCard => {
            const { x: placedX, y: placedY, card: placedCardInstance } = placedCard;

            const topNeighbor = placedX === x && placedY === y - cardSize;
            const bottomNeighbor = placedX === x && placedY === y + cardSize;
            const leftNeighbor = placedX === x - cardSize && placedY === y;
            const rightNeighbor = placedX === x + cardSize && placedY === y;

            if (topNeighbor) {
                return placedCardInstance.openSides.bottom && card.openSides.top;
            }
            if (bottomNeighbor) {
                return placedCardInstance.openSides.top && card.openSides.bottom;
            }
            if (leftNeighbor) {
                return placedCardInstance.openSides.right && card.openSides.left;
            }
            if (rightNeighbor) {
                return placedCardInstance.openSides.left && card.openSides.right;
            }

            return false;
        });
    }

    drawAllCards() {
        this.cardRenderer.drawAllCards(this.placedCards);
    }
}

class MonsterFactory {
    constructor(monsterTypes) {
        this.monsterTypes = monsterTypes;
    }

    selectRandomMonsterType() {
        let random = Math.random();
        for (let monsterType of this.monsterTypes) {
            if (random < monsterType.probability / 10) {
                return monsterType;
            }
            random -= monsterType.probability / 10;
        }
        return null;
    }

    createRandomMonster(){
        const monsterType =  this.selectRandomMonsterType() ;

        return new Monster(Date.now(), monsterType.type, monsterType.hitPoints, monsterType.treasure, 0,0);
    }
}


// CARD FACTORY
class CardFactory {
    constructor(cardTypes, monsterFactory) {
        this.cardTypes = cardTypes;
        this.monsterFactory = monsterFactory
        this.validateCardTypes();
        this.battleManager = new BattleManager();
    }

    validateCardTypes() {
        const totalProbability = this.cardTypes.reduce((sum, type) => sum + type.probability, 0);
        if (totalProbability !== 10) {
            throw new Error("The total probability of cardTypes must be 10. Currently:" + totalProbability);
        }
    }

    selectRandomCardType() {
        let random = Math.random();
        for (let cardType of this.cardTypes) {
            if (random < cardType.probability / 10) {
                return cardType.type;
            }
            random -= cardType.probability / 10;
        }
        return null;
    }

    generateRandomOpenSides(minOpenSides = null) {
        const openSides = {
            top: Math.random() < 0.6,
            right: Math.random() < 0.6,
            bottom: Math.random() < 0.6,
            left: Math.random() < 0.6
        };

        if (minOpenSides !== null) {
            const sideNames = ['top', 'right', 'bottom', 'left'];
            while (Object.values(openSides).filter(Boolean).length < minOpenSides) {
                const randomSide = sideNames[Math.floor(Math.random() * 4)];
                openSides[randomSide] = true;
            }
        }
        return openSides;
    }

    createRandomCard(type = null, minOpenSides = null) {
        const openSides = this.generateRandomOpenSides(minOpenSides);
        const cardType = type || this.selectRandomCardType();
        const newCard = new Card(Date.now(), openSides, cardType);

        // Wenn der Typ "Monsterraum" ist, fügen Sie ein Monster hinzu
        if (cardType === "Monsterraum") {
            const monster = this.monsterFactory.createRandomMonster();
            newCard.addMonster(monster);
            const battleCallback = (player, monsters, card) => {
                this.battleManager.initiateBattle(player, monsters, card);
            };
            newCard.addBattleCallback(battleCallback);
        }
        return newCard;
    }
}


// CARD RENDERER
class CardRenderer {
    constructor(context, canvas, cardSize) {
        this.context = context;
        this.canvas = canvas;
        this.cardSize = cardSize;
        this.doorClickThreshold = cardSize * 0.4;
    }

    drawAllCards(placedCards) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        placedCards.forEach(newCard => this.drawCard(newCard, placedCards));
    }

    drawCardType(placedCard) {
        this.context.fillText(
            placedCard.card.cardType[0],
            placedCard.x + this.cardSize / 2 - 5,
            placedCard.y + this.cardSize / 2
        );
    }

    drawConnection(x, y, width, height, isConnected) {
        this.context.fillStyle = isConnected ? "green" : "black";
        this.context.fillRect(x, y, width, height);
    }

    checkConnectedSides(x, y, existingCards) {
        const connectedSides = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };

        existingCards.forEach(neighborCard => {
            if (x === neighborCard.x && y - this.cardSize === neighborCard.y && neighborCard.card.openSides.bottom) {
                connectedSides.top = true;
            } else if (x === neighborCard.x && y + this.cardSize === neighborCard.y && neighborCard.card.openSides.top) {
                connectedSides.bottom = true;
            } else if (x - this.cardSize === neighborCard.x && y === neighborCard.y && neighborCard.card.openSides.right) {
                connectedSides.left = true;
            } else if (x + this.cardSize === neighborCard.x && y === neighborCard.y && neighborCard.card.openSides.left) {
                connectedSides.right = true;
            }
        });
        return connectedSides;
    }

    drawCard(placedCard, existingCards) {

        // Grundform der Karte
        this.context.strokeStyle = "black";
        this.context.strokeRect(placedCard.x, placedCard.y, this.cardSize, this.cardSize);

        // Zeichnen von speziellen Eigenschaften
        this.drawCardType(placedCard);

        // Überprüfen, ob es benachbarte Karten gibt und ob sie verbunden sind
        const { x, y, card } = placedCard;
        const connectedSides = this.checkConnectedSides(x, y, existingCards);

        // Zeichnen der offenen Seiten, grün wenn verbunden, schwarz wenn nicht
        if (card.openSides.top)
            this.drawConnection(x + this.cardSize * 0.4, y, this.cardSize * 0.2, this.cardSize * 0.2, connectedSides.top);

        if (card.openSides.right)
            this.drawConnection(x + this.cardSize * 0.8, y + this.cardSize * 0.4, this.cardSize * 0.2, this.cardSize * 0.2, connectedSides.right);

        if (card.openSides.bottom)
            this.drawConnection(x + this.cardSize * 0.4, y + this.cardSize * 0.8, this.cardSize * 0.2, this.cardSize * 0.2, connectedSides.bottom);

        if (card.openSides.left)
            this.drawConnection(x, y + this.cardSize * 0.4, this.cardSize * 0.2, this.cardSize * 0.2, connectedSides.left);

        // Zeichnen der Spieler und Monster
        this.drawEntities(placedCard.card.players, placedCard.x, placedCard.y, 'blue');  // Spieler in Blau
        this.drawEntities(placedCard.card.monsters, placedCard.x, placedCard.y, 'red'); // Monster in Rot
    }

    drawEntities(entities, x, y, color) {
        entities.forEach((entity) => {
            this.context.fillStyle = color;
            // Beispiel Positionierung - passt diese nach Bedarf an
            const entityX = x + entity.x
            const entityY = y + entity.y
            this.context.fillRect(entityX, entityY, entity.width, entity.height); // 20x20 Größe für jede Entität

            this.context.fillStyle = 'white';
            this.context.fillText(entity.name[0] + entity.hitPoints, entityX + 5, entityY + 15);
            this.context.fillStyle = 'black';
        });
    }
}


// TOOL TIP HANDLER
class TooltipHandler {
    constructor(tooltip, cardSize) {
        this.tooltip = tooltip;
        this.cardSize = 100; // Assume a default, or pass it as a parameter
        this.placedCards = []; // Initialize or pass as a parameter if needed
    }

    showTooltip(x, y, message) {
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
        this.tooltip.style.display = 'block';
        this.tooltip.textContent = message;
    }

    hideTooltip() {
        this.tooltip.style.display = 'none';
    }

    updateTooltip(event) {
        let cardUnderCursor = null;
        const x = event.clientX;
        const y = event.clientY;

        for (const placedCard of this.placedCards) {
            if (x > placedCard.x && x < placedCard.x + this.cardSize &&
                y > placedCard.y && y < placedCard.y + this.cardSize) {
                cardUnderCursor = placedCard.card;
                break;
            }
        }

        if (cardUnderCursor) {
            this.showTooltip(x, y, cardUnderCursor.cardType);
        } else {
            this.hideTooltip();
        }
    }
}

// EVENT HANDLERS
class EventHandlers {
    constructor(canvas, cardManager, tooltipHandler, cardSize) {
        this.canvas = canvas;
        this.cardManager = cardManager;
        this.tooltipHandler = tooltipHandler;
        this.cardSize = cardSize;
        this.draggingPlayer = null;
        this.draggingPlayerStartState = null;

        this.bindMethods();
        this.attachEventListeners();
    }

    bindMethods() {
        this.onClick = this.onClick.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    attachEventListeners() {
        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
    }

    onClick(event) {
        const { x, y } = this.getMousePosition(event);
        if (this.cardManager && typeof this.cardManager.newCardEvent === 'function') {
            this.cardManager.newCardEvent(x, y);
        }
    }

    onMouseMove(event) {
        if (!this.draggingPlayer) return;
        const { x, y } = this.getMousePosition(event);
        this.draggingPlayer.x = x - this.dragOffset.x;
        this.draggingPlayer.y = y - this.dragOffset.y;
        this.cardManager.drawAllCards();
    }

    onMouseDown(event) {
        const { x, y } = this.getMousePosition(event);
        this.draggingPlayer = this.cardManager.getPlayerAtPosition(x, y);
        if (this.draggingPlayer) {
            this.draggingPlayerStartState = {
                x: this.draggingPlayer.x,
                y: this.draggingPlayer.y,
                card: this.cardManager.findCardByPlayerId(this.draggingPlayer.id)
            };
            this.dragOffset = {
                x: x - this.draggingPlayer.x - 10,
                y: y - this.draggingPlayer.y - 10,
            };
        }
    }

    onMouseUp(event) {
        if (!this.draggingPlayer) return;
        const { x, y } = this.getMousePosition(event);
        if (!this.cardManager.placePlayerAtNewPosition(this.draggingPlayer, x, y)) {
            this.rollbackDraggingPlayer();
        }
        this.draggingPlayer = null;
        this.draggingPlayerStartState = null;
        this.cardManager.drawAllCards();
    }

    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }

    rollbackDraggingPlayer() {
        if (this.draggingPlayer && this.draggingPlayerStartState) {

            this.draggingPlayer.x = this.draggingPlayerStartState.x;
            this.draggingPlayer.y = this.draggingPlayerStartState.y;

            const currentPlayerCard = this.cardManager.findCardByPlayerId(this.draggingPlayer.id);
            if (currentPlayerCard !== this.draggingPlayerStartState.card) {
                currentPlayerCard && currentPlayerCard.card.removePlayer(this.draggingPlayer.id);
                this.draggingPlayerStartState.card.card.addPlayer(this.draggingPlayer);
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('dungeonCanvas');
    const context = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    if (!canvas || !tooltip) {
        console.error("Canvas or Tooltip not found!");
        return;
    }

    const cardSize = 100;
    const monsterTypes = [
        { type: "Drache", probability: 1, hitPoints:15, treasure: new Treasure("Schatz",0, false, false) },
        { type: "Seelenräuber", probability: 1, hitPoints:12, treasure: new Treasure("Schatz",0, false, false) },
        { type: "Skelett-König", probability: 1, hitPoints:10, treasure: new Treasure("Axt",3, true, false) },
        { type: "Skelett-Krieger", probability: 1, hitPoints:9, treasure: new Treasure("Schwert",2, true, false) },
        { type: "Skelett-Wärter", probability: 1, hitPoints:8, treasure: new Treasure("Schlüssel",0, false, false) },
        { type: "Mumie", probability: 1, hitPoints:7, treasure: new Treasure("Flammenzauber",1, true, false) },
        { type: "Riesenspinne", probability: 2, hitPoints:6 , treasure: new Treasure("Heilzauber",1, false, true) },
        { type: "Ratte", probability: 2, hitPoints:5, treasure: new Treasure("Dolche",1, true, false) }
    ];
    const cardTypes = [
        { type: "Heilungsraum", probability: 1 },
        { type: "Teleport", probability: 1 },
        { type: "Monsterraum", probability: 5 },
        { type: "Weg", probability: 3 }
    ];
    const monsterFactory = new MonsterFactory(monsterTypes)
    const cardFactory = new CardFactory(cardTypes, monsterFactory);
    const cardRenderer = new CardRenderer(context, canvas, cardSize);
    const cardManager = new CardManager(cardFactory, cardRenderer);
    const tooltipHandler = new TooltipHandler(tooltip, cardSize);
    const eventHandlers = new EventHandlers(canvas, cardManager, tooltipHandler, cardSize);

    eventHandlers.attachEventListeners();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('load', resizeCanvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cardManager.drawAllCards(); // Ensure this doesn't lead to performance issues
    }

    // Consider replacing this with a more dynamic approach
    cardManager.placeNewCard(window.innerWidth / 2, window.innerHeight / 2, "Heilungsraum", 4);
    const player1 = new Player("p1", "Argentus - der Magier",5, 0, 1,0, 0);
    //const player2 = new Player("p2", "Horan - der Krieger", 5, 0, 4, 20, 0);
    cardManager.addPlayer(window.innerWidth / 2, window.innerHeight / 2, player1);
   // cardManager.addPlayer(window.innerWidth / 2, window.innerHeight / 2, player2);

});
