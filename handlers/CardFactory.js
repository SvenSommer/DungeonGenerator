class CardFactory {
    constructor(cardTypes, monsterFactory, battleManager) {
        this.cardTypes = cardTypes;
        this.monsterFactory = monsterFactory
        this.validateCardTypes();
        this.battleManager = battleManager
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
