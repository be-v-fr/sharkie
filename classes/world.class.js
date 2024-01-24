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
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                let enemy = this.enemies[i];
                if (enemy.state != 'dead') {
                    this.checkCharacter(enemy);
                    this.checkBubbles(enemy);
                } else if (enemy.y < -100 || enemy.y > 600) {
                    this.enemies = removeAt(i, this.enemies);                    
                }
            }
        }, 100);
    }

    checkCharacter(enemy) {
        if (enemy instanceof Pufferfish && enemy.state != 'attacking') {
            if (enemy.x - this.character.x < 100 + 320 * (1 - Math.random())) {
                enemy.attack();
            }
        }
        if (this.character.isColliding(enemy) && this.character.isRecovered()) {
            this.character.hurt(enemy);
            this.stats[0].update(this.character.health);
            this.character.recover();
        }
    }

    checkBubbles(enemy) {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            let bubble = this.bubbles[i];
            if (bubble.isColliding(enemy)) {
                enemy.hit(bubble.getDamage());
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