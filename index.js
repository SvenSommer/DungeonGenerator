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
    const logRenderer = new LogRenderer(context, 10,420,410,300,5 );
    const battleManager = new BattleManager(logRenderer);
    const cardFactory = new CardFactory(cardTypes, monsterFactory, battleManager);
    const cardRenderer = new CardRenderer(context, canvas, cardSize);
    const playerBoardRenderer = new PlayerBoardRenderer(context,  10,10,200,400)
    const worldManager = new WorldManager(cardFactory, cardRenderer, playerBoardRenderer, logRenderer);
    const tooltipHandler = new TooltipHandler(tooltip, cardSize);
    const eventHandlers = new EventHandlers(canvas, worldManager, tooltipHandler, cardSize);

    eventHandlers.attachEventListeners();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('load', resizeCanvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        worldManager.draw(); // Ensure this doesn't lead to performance issues
    }

    // Consider replacing this with a more dynamic approach
    worldManager.placeNewCard(window.innerWidth / 2, window.innerHeight / 2, "Heilungsraum", 4);
    const player1 = new Player("p1", "Argentus - der Magier",5, 0, 1,0, 0);
    const player2 = new Player("p2", "Horan - der Krieger", 5, 0, 4, 20, 0);
    worldManager.addPlayer(window.innerWidth / 2, window.innerHeight / 2, player1);
    worldManager.addPlayer(window.innerWidth / 2, window.innerHeight / 2, player2);

});