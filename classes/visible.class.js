class Visible {
    img;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    frame = [null, null, null, null];

    // VS Code Plugin "Copy Relative Path" installieren (für korrekte Slash-Striche)!!
    // für "movable" und "stats" ggf. Superklasse "visual" erstellen
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    initFrame(dX, dY, width, height) {
        this.frame[0] = dX;
        this.frame[1] = dY;
        this.frame[2] = width;
        this.frame[3] = height;
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Pufferfish || this instanceof Bubble) {
            ctx.beginPath();
            ctx.rect(this.x + this.frame[0], this.y + this.frame[1], this.frame[2], this.frame[3]);
            ctx.stroke();
        }
    }

    playAnimation() { // Methode, um Animation einmal abzuspielen, kann durch loop/Intervall in "animate()" aufgerufen werden

    }
}