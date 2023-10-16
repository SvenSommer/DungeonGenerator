class LogRenderer {
    constructor(context, x, y, width, height, maxMessages = 5) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxMessages = maxMessages;
        this.messages = [];
    }

    addMessage(message) {
        this.messages.push(message);
        if (this.messages.length > this.maxMessages) {
            this.messages.shift(); // Älteste Nachricht entfernen
        }
        this.draw();
    }

    draw() {
        // Grundrahmen für den Log zeichnen
        this.context.strokeStyle = 'black';
        this.context.strokeRect(this.x, this.y, this.width, this.height);
        
        let offsetY = 20;
        this.messages.forEach(message => {
            this.context.fillText(message, this.x + 10, this.y + offsetY);
            offsetY += 20;
        });
    }
}
