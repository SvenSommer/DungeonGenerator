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