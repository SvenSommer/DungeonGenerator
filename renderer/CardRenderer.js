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