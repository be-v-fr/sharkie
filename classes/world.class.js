class World {
    canvas;
    keyboard;
    ctx;
    backdrop = level1.backdrop;
    backdropUnits = level1.backdropUnits;
    length = level1.length;
    light = new Backdrop(4, 0);
    character = new Character();
    translateX = -this.character.xStart;
    floor = level1.floor; // absolute Char-Position: character.x -
    dX = this.character.x - this.character.xStart - this.floor.x;
    enemies = level1.enemies;
    stats = [
        new Stats(16, 2, 'health'),
        new Stats(16, 2 + 1 * 40, 'coins'),
        new Stats(16, 2 + 2 * 40, 'poison')
    ];
    bubbles = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.checkPositions();
        this.keyboard = keyboard;
        this.floor.moveX(-this.floor.speed);
        this.stats[1].update(this.character.coins);
        this.stats[2].update(this.character.poison);
        this.draw();
        this.set();
    }

    set() {
        setInterval(() => {
            this.character.world = this;
            this.translateX = this.character.x - this.character.xStart;
            this.dX = this.character.x - this.character.xStart - this.floor.x;
            this.character.act();
            this.setBackdrop();
        }, 5);
    }

    setBackdrop() {
        this.setFloor();
        for (let i = 0; i < this.backdrop.length; i++) {
            const layer = this.backdrop[i];
            if (layer != this.floor) {
                layer.x = layer.xStart + this.floor.x * layer.speedFactor;
            }
        }
    }

    setFloor() {
        if (this.character.state == 'swim left' && this.floor.speed > 0) {
            this.floor.turnAround();
        } else {
            if (this.floor.speed < 0) {
                this.floor.turnAround();
            }
        }
    }

    checkPositions() {
        setInterval(() => {
            this.enemies.forEach((enemy) => {
                this.checkCharacter(enemy);
                this.checkBubbles(enemy);
            })
        }, 100);
    }

    checkCharacter(enemy) {
        if (enemy.x - this.character.x < 100 + 320 * (1 - Math.random())) {
            if (enemy.state != 'attacking') {
                enemy.attack();
            } else if (this.character.isColliding(enemy)) {
                if (this.character.isRecovered()) {
                    this.character.clearState();
                    this.character.state = 'hit';
                    this.keyboard.toggleControls(true);
                    if (enemy instanceof Pufferfish) {
                        this.character.animate('hurt poisoned');
                        this.character.hit(4);
                        this.stats[0].update(this.character.health);
                    }
                    setTimeout(() => {
                        this.keyboard.toggleControls(false);
                        this.character.idle();
                    }, 400);
                }
            }
        }
    }




    checkBubbles(enemy) {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            let bubble = this.bubbles[i];
            if (bubble.isColliding(enemy)) {
                enemy.hit(bubble.getDamage());
                bubble.pop(); // Sound und, falls vorhanden, Animation
                this.bubbles = removeAt(i, this.bubbles);
            } else if (bubble.y < 0) { // falls keine Kollision, jedoch Blase über Bildrand
                this.bubbles = removeAt(i, this.bubbles);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.translate(-this.translateX, 0);
        this.addBackdrop();
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.bubbles);
        this.ctx.translate(this.translateX, 0);
        // ohne translate:
        this.addObjectsToMap(this.stats);
        this.recallDraw();
    }

    addBackdrop() {
        this.addObjectsToMap(this.backdrop);
    }

    addObjectsToMap(obj) {
        obj.forEach(o => { this.addToMap(o) });
    }

    addToMap(vis) {
        if (vis.otherDirection) {
            this.flipImage(vis);
        }
        vis.draw(this.ctx);
        vis.drawFrame(this.ctx);
        if (vis.otherDirection) {
            this.unflipImage();
        }
    }

    flipImage(vis) {
        this.ctx.save();
        this.ctx.translate(2 * vis.x + vis.width, 0);
        this.ctx.scale(-1, 1);
    }

    unflipImage() {
        this.ctx.restore();
    }

    recallDraw() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}