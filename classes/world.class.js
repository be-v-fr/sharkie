class World {
    canvas;
    keyboard;
    ctx;
    backdrop = level1.backdrop;
    backdropUnits = level1.backdropUnits;
    length = level1.length;
    character = new Character();
    translateX = -this.character.xStart;
    floor = level1.floor;
    dX = this.character.x - this.character.xStart - this.floor.x;
    obstacles = level1.obstacles;
    items = level1.items;
    numberOfCoins = level1.getNumberOfCoins();
    enemies = level1.enemies;
    boss = this.enemies[this.enemies.length - 1];
    stats = [
        new Stats(16, 2, 'health'),
        new Stats(16, 2 + 1 * 40, 'coins'),
        new Stats(16, 2 + 2 * 40, 'poison')
    ];
    bubbles = [];
    stop = false;
    bossFight = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
    }

    start() {
        this.floor.moveX(-this.floor.speed);
        this.stats[1].update(this.character.coins);
        this.stats[2].update(this.character.poison);
        this.set();
        this.checkPositions();
        this.draw();
    }

    set() {
        setInterval(() => {
            if (!this.stop) {
                this.character.world = this;
                if (!this.bossFight) {
                    this.translateX = this.character.x - this.character.xStart;
                    this.dX = this.translateX - this.floor.x;
                    this.setBackdrop();
                    this.adjustToFloor(this.obstacles);
                    this.adjustToFloor(this.items);
                }
                this.character.act();
            }
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

    adjustToFloor(mov) {
        mov.forEach(m => { m.x = m.xStart + this.floor.x });
    }

    checkPositions() {
        setInterval(() => {
            this.checkObstacles();
            this.checkItems();
            this.checkEnemies();
            if (!this.bossFight && this.translateX >= this.boss.xStart - 380) {
                this.initBossFight();
            }
        }, 100);
    }

    checkObstacles() {
        this.obstacles.forEach(o => {
            this.checkCharCollision(o);
            this.obstacles.forEach(o => { this.checkCharCollision(o) });
            for (let i = this.bubbles.length - 1; i >= 0; i--) {
                let bubble = this.bubbles[i];
                if (bubble.isColliding(o) && bubble.isEmpty) {
                    bubble.playSound('pop');
                    this.bubbles = removeAt(i, this.bubbles);
                }
            }
        });
    }

    checkItems() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (this.character.isColliding(item)) {
                this.character.collectItem(item);
                this.items = removeAt(i, this.items);
            }
        }
    }

    checkEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.state != 'dead') {
                this.checkCharacter(enemy);
                if (enemy.isDead() && !(enemy instanceof Boss)) {
                    this.enemies = removeAt(i, this.enemies);
                } else {
                    this.checkBubbles(enemy);
                }
            } else if (enemy.y < -100 || enemy.y > 600) {
                this.enemies = removeAt(i, this.enemies);
            }
        }
    }

    checkCharacter(enemy) {
        this.checkPufferfishAttack(enemy);
        this.checkCharCollision(enemy);
    }

    checkPufferfishAttack(enemy) {
        if (enemy instanceof Pufferfish && enemy.state != 'attacking') {
            if (enemy.x - this.character.x < 100 + 320 * (1 - Math.random())) {
                enemy.attack();
            }
        }
    }

    checkCharCollision(obj) {
        if (this.character.isColliding(obj)) {
            if (this.character.slapping && !(obj instanceof Obstacle) && !(obj instanceof Jellyfish && obj.color == 'green')) {
                if (obj.canGetHit()) {
                    obj.hit(this.character);
                }
            } else {
                this.character.slapping = false;
                if (obj instanceof Obstacle || this.character.isRecovered()) {
                    this.character.hurt(obj);
                    this.stats[0].update(this.character.health);
                }
            }
        }
    }

    checkBubbles(enemy) {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            let bubble = this.bubbles[i];
            if (bubble.isColliding(enemy) && bubble.isEmpty) {
                if (enemy.canGetHit()) {
                    this.enemyHitByBubble(bubble, enemy, i);
                }
            } else if (bubble.y < 0) {
                this.bubbles = removeAt(i, this.bubbles);
            }
        }
    }

    enemyHitByBubble(bubble, enemy, i) {
        enemy.hit(bubble);
        if (enemy instanceof Jellyfish) {
            bubble.catchJellyfish(enemy.color);
            this.enemies = removeAt(this.enemies.indexOf(enemy), this.enemies);
        } else {
            bubble.playSound('pop');
            this.bubbles = removeAt(i, this.bubbles);
        }
    }

    initBossFight() {
        // Char-Bewegung begrenzen
        this.bossFight = true;
        clearInterval(this.floor.moveIntervalId);
        this.boss.spawn();
    }

    draw() {
        if (!this.stop) {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.translate(-this.translateX, 0);
            this.addBackdrop();
            this.addObjectsToMap(this.obstacles);
            this.addObjectsToMap(this.items);
            this.addToMap(this.character);
            this.addObjectsToMap(this.enemies);
            this.addObjectsToMap(this.bubbles);
            this.ctx.translate(this.translateX, 0);
            // ohne translate:
            this.addObjectsToMap(this.stats);
            this.recallDraw();
        }
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