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
    stats = [
        new Stats(16, 2),
        new Stats(16, 2 + 1 * 36),
        new Stats(16, 2 + 2 * 36)
    ];
    bubbles = [];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.checkCollisions();
        this.draw();
    }

    checkCollisions() {
        setInterval(() => {
            this.enemies.forEach((enemy) => {
                this.checkCharacter(enemy);
                this.checkBubbles(enemy);
            })
        }, 200);
    }

    checkCharacter(enemy) {
        if (this.character.isColliding(enemy)) {
            this.character.hit(4);
            this.stats[0].update(this.character.health);
        }
    }

    checkBubbles(enemy) {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            let bubble = this.bubbles[i];
            if (bubble.isColliding(enemy)) {
                enemy.hit(bubble.getDamage());
                bubble.pop(); // Sound und, falls vorhanden, Animation
                this.bubbles = removeAt(i, this.bubbles);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.addObjectsToMap(this.backdrop);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.bubbles);
        // ohne translate:
        this.addObjectsToMap(this.stats);
        this.recallDraw();
    }

    addObjectsToMap(obj) {
        obj.forEach(o => { this.addToMap(o) });
    }

    addToMap(vis) {
        vis.draw(this.ctx);
        vis.drawFrame(this.ctx);
    }

    recallDraw() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}