class World {
    canvas;
    ctx;
    character = new Character();
    enemies = [
        new Pufferfish(),
        new Pufferfish(),
        new Pufferfish()
    ];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        const char = this.character;
        this.ctx.drawImage(char.img, char.x, char.y, char.width, char.height);
        this.enemies.forEach(e => {
            this.ctx.drawImage(e.img, e.x, e.y, e.width, e.height)
        });
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}