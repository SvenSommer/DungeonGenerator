class Player {
    constructor(id, name, maxHealthPoints, hitPoints, maxSteps, x, y) {
        this.id = id;
        this.name = name;
        this.healthPoints = maxHealthPoints
        this.maxHealthPoints = maxHealthPoints
        this.hitPoints = hitPoints;
        this.maxSteps = maxSteps
        this.treasure = [];
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
    }
    addTreasure(treasure) {
        this.treasure.push(treasure)
        if (treasure.weapon)
            this.hitPoints += treasure.hitPoints;
    }

    restoreHealth() {
        this.healthPoints = this.maxHealthPoints;
    }
}
