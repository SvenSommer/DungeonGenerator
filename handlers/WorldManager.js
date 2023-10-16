class WorldManager {
    constructor(cardFactory, cardRenderer, playerBoardRenderer, logRenderer) {
        this.cardFactory = cardFactory;
        this.cardRenderer = cardRenderer;
        this.playerBoardRenderer = playerBoardRenderer;
        this.logRenderer = logRenderer;
        this.placedCards = [];
        this.players = [];
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
        this.draw();
    }

    addPlayer(x, y, player) {
        const card = this.findCardAt(x, y);

        if (!card) {
            console.error(`No card found at position (${x}, ${y})`);
            return;
        }

        card.card.addPlayer(player, x, y);
        this.players.push(player);
        this.draw();
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

    draw() {
        this.cardRenderer.drawAllCards(this.placedCards);
        this.playerBoardRenderer.drawPlayers(this.players)
        this.logRenderer.draw()
    }
}
