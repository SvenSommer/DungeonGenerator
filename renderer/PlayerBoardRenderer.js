class PlayerBoardRenderer {
    constructor(context, initialX, y, width, height, playerCount) {
        this.context = context;
        this.initialX = initialX;
        this.y = y;
        this.width = width;
        this.height = height;
        this.playerCount = playerCount;
        this.spacing = 10; // Platz zwischen den Dashboards
    }

    drawPlayers(players) {
        players.forEach((player, index) => {
            // Dynamischer X-Wert basierend auf der Indexposition des Spielers
            this.x = this.initialX + (this.width + this.spacing) * index;
            this.draw(player);
        });
    }

    draw(player) {
        // Grundrahmen für das Dashboard zeichnen
        this.context.strokeStyle = 'black';
        this.context.strokeRect(this.x, this.y, this.width, this.height);
        
        // Name des Spielers
        this.context.fillText(player.name, this.x + 10, this.y + 20);

        this.showHealthBar(player);
        // Trefferpunkte
        this.context.fillText('Schaden: ' + player.hitPoints, this.x + 10, this.y + 60);
        
        // Schätze/Items
        this.showTreasures(player);
    }

    showHealthBar(player) {
        const heartUnicode = "❤️";  // Herz-Symbol
        const skullUnicode = "💀";  // Totenkopf-Symbol
        const spacingBetweenIcons = 20;  // Abstand zwischen den Symbolen

        for(let i = 0; i < player.maxHealthPoints; i++) {
            if (i < player.healthPoints) {
                this.context.fillStyle = 'red';
                this.context.fillText(heartUnicode, this.x + 10 + (i * spacingBetweenIcons), this.y + 40);
            } else {
                this.context.fillStyle = 'black';
                this.context.fillText(skullUnicode, this.x + 10 + (i * spacingBetweenIcons), this.y + 40);
            }
        }

        this.context.fillStyle = 'black';  // Farbe zurücksetzen
    }

    showTreasures(player) {
        const treasuresMapping = {
            "Schatz": "💎",
            "Axt": "⛏️",
            "Schwert": "⚔️",
            "Schlüssel": "🔑",
            "Flammenzauber": "🔥",
            "Heilzauber": "🌟",
            "Dolche": "🗡️"
        };

        let treasureCounts = {};
        player.treasure.forEach(item => {
            if (!treasureCounts[item.name]) {
                treasureCounts[item.name] = 1;
            } else {
                treasureCounts[item.name]++;
            }
        });

        let offsetY = 80;
        Object.keys(treasureCounts).forEach(treasureName => {
            if (treasuresMapping[treasureName]) {
                let multiplier = treasureCounts[treasureName] > 1 ? ` x${treasureCounts[treasureName]}` : '';
                this.context.fillText(treasuresMapping[treasureName] + multiplier, this.x + 10, this.y + offsetY);
                offsetY += 20;
            }
        });
    }
}


// CARD RENDERER