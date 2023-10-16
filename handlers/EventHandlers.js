class EventHandlers {
    constructor(canvas, worldManager, tooltipHandler, cardSize) {
        this.canvas = canvas;
        this.worldManager = worldManager;
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
        if (this.worldManager && typeof this.worldManager.newCardEvent === 'function') {
            this.worldManager.newCardEvent(x, y);
        }
    }

    onMouseMove(event) {
        if (!this.draggingPlayer) return;
        const { x, y } = this.getMousePosition(event);
        this.draggingPlayer.x = x - this.dragOffset.x;
        this.draggingPlayer.y = y - this.dragOffset.y;
        this.worldManager.draw();
    }

    onMouseDown(event) {
        const { x, y } = this.getMousePosition(event);
        this.draggingPlayer = this.worldManager.getPlayerAtPosition(x, y);
        if (this.draggingPlayer) {
            this.draggingPlayerStartState = {
                x: this.draggingPlayer.x,
                y: this.draggingPlayer.y,
                card: this.worldManager.findCardByPlayerId(this.draggingPlayer.id)
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
        if (!this.worldManager.placePlayerAtNewPosition(this.draggingPlayer, x, y)) {
            this.rollbackDraggingPlayer();
        }
        this.draggingPlayer = null;
        this.draggingPlayerStartState = null;
        this.worldManager.draw();
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

            const currentPlayerCard = this.worldManager.findCardByPlayerId(this.draggingPlayer.id);
            if (currentPlayerCard !== this.draggingPlayerStartState.card) {
                currentPlayerCard && currentPlayerCard.card.removePlayer(this.draggingPlayer.id);
                this.draggingPlayerStartState.card.card.addPlayer(this.draggingPlayer);
            }
        }
    }
}