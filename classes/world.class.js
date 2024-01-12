class World {
    canvas;
    ctx;
    backdrop = [
        new Backdrop('./img/background/Layers/5.Water/D.png'),
        new Backdrop('./img/background/Layers/4.Fondo/D.png'),
        new Backdrop('./img/background/Layers/3.Fondo/D.png'),
        new Backdrop('./img/background/Layers/2.Floor/D.png'),
        new Backdrop('./img/background/Layers/1.Light/D.png')
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
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.addObjectsToMap(this.backdrop);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.recallDraw();
    }

    addObjectsToMap(obj) {
        obj.forEach(o => { this.addToMap(o) });
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }

    recallDraw() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}