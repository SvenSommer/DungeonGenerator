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