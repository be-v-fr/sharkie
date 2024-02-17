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
        new Stats(16, 2 + 2 * 40, 'poison'),
        new Stats(514, -100, 'boss_health')
    ];
    bubbles = [];
    stop = false;
    bossFight = false;
    setWorld;

    /**
     * constructor
     * @param {Object} canvas - canvas object
     * @param {Object} keyboard - keyboard object
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.stats[3].otherDirection = true;
    }


    /**
     * start ingame world/level
     */
    start() {
        this.floor.moveX(-this.floor.speed);
        this.stats[1].update(this.character.coins);
        this.stats[2].update(this.character.poison);
        this.set();
        this.checkPositions();
        this.draw();
        music['main'].play();
    }


    /**
     * set current positions including character controls
     */
    set() {
        this.setWorld = setInterval(() => {
            if (!this.stop) {
                this.character.world = this;
                if (!this.bossFight) {
                    this.translateX = this.character.x - this.character.xStart;
                    this.dX = this.translateX - this.floor.x;
                    this.setBackdrop();
                    this.adjustToFloor(this.obstacles);
                    this.adjustToFloor(this.items);
                }
                this.keyboard.play();
            }
        }, 5);
    }


    /**
     * set backdrop (motion specific to layer, relative to floor layer)
     */
    setBackdrop() {
        this.setFloor();
        for (let i = 0; i < this.backdrop.length; i++) {
            const layer = this.backdrop[i];
            if (layer != this.floor) {
                layer.x = layer.xStart + this.floor.x * layer.speedFactor;
            }
        }
    }


    /**
     * set backdrop floor layer
     */
    setFloor() {
        if (this.character.state == 'swim left' && this.floor.speed > 0) {
            this.floor.turnAround();
        } else {
            if (this.floor.speed < 0) {
                this.floor.turnAround();
            }
        }
    }


    /**
     * adjust movable objects relative to floor position
     * @param {Array} mov - movable objects 
     */
    adjustToFloor(mov) {
        mov.forEach(m => { m.x = m.xStart + this.floor.x });
    }


    /**
     * check and handle positions
     */
    checkPositions() {
        setInterval(() => {
            this.checkObstacles();
            this.checkItems();
            this.checkEnemies();
            if (!this.bossFight && this.dX >= this.boss.xStartAbsolute - 380) {
                this.initBossFight();
            }
        }, 100);
    }


    /**
     * check and handle obstacles (character and bubble interaction)
     */
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


    /**
     * check and handle items (character interaction)
     */
    checkItems() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (this.character.isColliding(item)) {
                item.collect();
                this.items = removeAt(i, this.items);
            }
        }
    }


    /**
     * check and handle enemies (character and bubble interaction)
     */
    checkEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.state != 'dead') {
                this.checkCharacter(enemy);
                if (enemy instanceof Jellyfish && enemy.isDead()) {
                    this.enemies = removeAt(i, this.enemies);
                } else {
                    this.checkBubbles(enemy);
                }
            } else if ((enemy.y < -100 || enemy.y > 600) && !(enemy instanceof Boss)) {
                this.enemies = removeAt(i, this.enemies);
            }
        }
    }


    /**
     * check character with respect to a given enemy
     * @param {Object} enemy - enemy object
     */
    checkCharacter(enemy) {
        this.checkPufferfishAttack(enemy);
        this.checkCharCollision(enemy);
    }


    /**
     * check if a pufferfish will attack now
     * @param {Object} enemy - pufferfish object
     */
    checkPufferfishAttack(enemy) {
        if (enemy instanceof Pufferfish && enemy.state != 'attacking' && !enemy.isDead()) {
            if (enemy.x - this.character.x < 100 + 320 * (1 - Math.random())) {
                enemy.attack();
            }
        }
    }


    /**
     * check character with respect to a possible collision with a given object
     * @param {Object} obj - movable object
     */
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


    /**
     * check all bubbles with respect to a given enemy
     * @param {Object} enemy - enemy object
     */
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


    /**
     * this function handles a hit of an enemy by a bubble
     * @param {Object} bubble - bubble object
     * @param {Object} enemy - enemy object
     * @param {Number} i - index of bubble within this.bubbles
     */
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


    /**
     * boss fight initialization
     */
    initBossFight() {
        const ingameSettings = document.getElementById('ingameSettingsWrapper');
        ingameSettings.classList.add('mobileCenter');
        this.bossFight = true;
        clearInterval(this.floor.moveIntervalId);
        this.boss.spawn();
        this.stats[3].y = 2;
    }


    /**
     * draw game onto canvas
     */
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
            this.addObjectsToMap(this.stats);
            this.recallDraw();
        }
    }


    /**
     * add backdrop to canvas drawing
     */
    addBackdrop() {
        this.addObjectsToMap(this.backdrop);
    }


    /**
     * add object array to canvas drawing
     * @param {Array} obj - objects
     */
    addObjectsToMap(obj) {
        obj.forEach(o => { this.addToMap(o) });
    }


    /**
     * add sinlge object to canvas drawing
     * @param {Object} vis - visible object 
     */
    addToMap(vis) {
        if (vis.otherDirection) {
            this.flipImage(vis);
        }
        vis.draw(this.ctx);
        if (vis.otherDirection) {
            this.unflipImage();
        }
    }


    /**
     * mirror image horizontally
     * @param {Object} vis - visible object 
     */
    flipImage(vis) {
        this.ctx.save();
        this.ctx.translate(2 * vis.x + vis.width, 0);
        this.ctx.scale(-1, 1);
    }

    
    /**
     * stop mirroring images
     */
    unflipImage() {
        this.ctx.restore();
    }


    /**
     * recall canvas drawing method to draw the next frame
     */
    recallDraw() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }


    /**
     * this function handles a game win
     */
    win() {
        this.stop = true;
        clearInterval(this.setWorld);
        showEndscreen('You win!');
        const endscreen = document.getElementById('endscreen');
        endscreen.classList.add('winscreen');
    }


    /**
     * this function handles a game over (lost)
     */
    lose() {
        this.stop = true;
        this.boss.clearAllIntervals();
        clearInterval(this.setWorld);
        showEndscreen('Game Over');
        const endscreen = document.getElementById('endscreen');
        endscreen.classList.add('gameOver');  
    }
}