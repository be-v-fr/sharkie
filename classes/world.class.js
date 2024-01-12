class World {
    canvas;
    ctx;
    backdrop = [
        new Movable(),
        new Movable(),
        new Movable(),
        new Movable()
    ]
    character = new Character();
    enemies = [
        new Pufferfish(),
        new Pufferfish(),
        new Pufferfish()
    ];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.backdrop[0].loadImage('./img/background/Layers/5.Water/D.png');
        this.backdrop[1].loadImage('./img/background/Layers/4.Fondo/D.png');
        this.backdrop[2].loadImage('./img/background/Layers/2.Floor/D.png');
        this.backdrop[3].loadImage('./img/background/Layers/1.Light/D.png');
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.backdrop.forEach(b => {
            this.ctx.drawImage(b.img, b.x, b.y, 1440, 480)
        });
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