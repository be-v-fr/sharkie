class Boss extends Movable {
    width = 360;
    height = 480;
    attackId = -1;
    xStartAbsolute;
    fullHealth;

    /**
     * constructor
     * @param {Number} xStartAbsolute - absolute starting position, disregarding relative floor movement
     */
    constructor(xStartAbsolute) {
        super().loadImage('./img/enemy/boss/introduce/1.png');
        this.x = -1000;
        this.xStartAbsolute = xStartAbsolute;
        this.y = 0;
        this.setDamage(10, 20);
        this.setHealth();
        this.recoveryDuration = 1600;
        this.initFrame(32, 240, 280, 140);
        this.initFrame(170, 170, 30, 100);
    }


    /**
     * set full health and starting health according to game difficulty
     */
    setHealth() {
        if (settings['hardMode']) {
            this.fullHealth = 60;
        } else {
            this.fullHealth = 40;
        }
        this.health = this.fullHealth;
    }


    /**
     * clear all movement and animation intervals
     */
    clearAllIntervals() {
        this.clearIntervals();
        this.clearBossIntervals();
    }


    /**
     * clear boss specific movement intervals
     */
    clearBossIntervals() {
        clearInterval(this.moveIntervalId);
        if (this.attackId != -1) {
            clearInterval(this.attackId);
            this.attackId = -1;
        }
    }


    /**
     * spawn boss
     */
    spawn() {
        this.setSpawningPosition();
        this.startBossMusic();
        this.x = this.xStart;
        this.playAnimationOnceWithSound('introduce', 1000 / 12);
        const moveSpawning = setInterval(() => {
            this.x -= 0.8;
            if (this.x <= this.xStart - 14) {
                this.setCycle(0, 0);
                clearInterval(moveSpawning);
            }
        }, 1000 / 60)
        this.animate('floating', 1000 / 8);
    }


    /**
     * set relative x spawning position 
     */
    setSpawningPosition() {
        this.xStart = this.xStartAbsolute + world.floor.x;
    }


    /**
     * change music track
     */
    startBossMusic() {
        music['main'].pause();
        music['boss'].play();
    }


    /**
     * set basic cycle of boss movement and actions
     * @param {Number} horizontal - number of iteration steps for x movement
     * @param {Number} vertical - number of iteration steps for y movement
     */
    setCycle(horizontal, vertical) {
        this.moveIntervalId = setInterval(() => {
            horizontal %= 150;
            vertical %= 130;
            this.moveCycle(horizontal, vertical);
            horizontal++;
            vertical++;
            this.act();
        }, 1000 / 30);
    }


    /**
     * movement cycle
     * @param {Number} horizontal - number of iteration steps for x movement
     * @param {Number} vertical - number of iteration steps for y movement
     */
    moveCycle(horizontal, vertical) {
        this.moveHorizontal(horizontal);
        this.moveVertical(vertical);
    }


    /**
     * movement cycle along x axis
     * @param {Number} index - number of iteration steps
     */
    moveHorizontal(index) {
        if (index < 120) {
            this.x -= 2;
        } else {
            this.x += 8;
        }
    }


    /**
     * movement cycle along y axis
     * @param {Number} index - number of iteration steps
     */
    moveVertical(index) {
        if (index < 65) {
            this.y -= 3;
        } else {
            this.y += 3;
        }
    }


    /**
     * perform actions ((a) attack, (b) face character)
     */
    act() {
        if (this.isReadyForAction()) {
            this.setDirection();
            if (Math.random() < 0.025) {
                this.attack();
            }
        }
    }


    /**
     * request readiness for new action
     * @returns {Boolean} - are the conditions for a new action fulfilled?
     */
    isReadyForAction() {
        return this.attackId == -1 && this.singleAnimationId == -1 && Date.now() - this.lastHit > this.recoveryDuration / 2;
    }


    /**
     * set boss to face character
     */
    setDirection() {
        if (world.character.x > this.x + 100) {
            this.otherDirection = true;
        } else {
            this.otherDirection = false;
        }
    }


    /**
     * perform attack
     */
    attack() {
        this.playAnimationOnceWithSound('attack', 1000 / 12);
        let i = 0;
        this.attackId = setInterval(() => {
            this.attackMove(i);
            i++;
            if (i == 36) {
                this.finishAttack();
            }
        }, 1000 / 30)
    }


    /**
     * movement iteration step of attack
     * @param {Number} index - current iteration step
     */
    attackMove(index) {
        if (index < 18) {
            this.startAttack(index);
        } else {
            this.endAttack(index);
        }
    }


    /**
     * movement iteration step during first attack phase
     * @param {Number} index - current iteration step
     */
    startAttack(index) {
        if (this.otherDirection) {
            this.x += index;
        } else {
            this.x -= index;
        }
    }


    /**
     * movement iteration step during second (final) attack phase
     * @param {Number} index - current iteration step
     */
    endAttack(index) {
        if (this.otherDirection) {
            this.x -= (index - 18);
        } else {
            this.x += (index - 18);
        }
    }


    /**
     * finish and clear attack
     */
    finishAttack() {
        clearInterval(this.attackId);
        this.attackId = -1;
    }


    /**
     * hit by object: status change, movement and animation
     * @param {Object} obj - hitting object
     */
    hit(obj) {
        super.hit(obj);
        world.stats[3].update(this.getHealthPercentage());
        this.stopSound('attack');
        if (!this.isDead()) {
            this.state = 'hit';
            this.clearBossIntervals();
            this.playAnimationOnceWithSound('hurt', 1000 / 12);
            this.retreat();
        }
    }


    /**
     * request relative rather than absolute health value
     * @returns {Number} percentage value of health
     */
    getHealthPercentage() {
        return 100* this.health / this.fullHealth; 
    }


    /**
     * move back to spawning position to restart main cycle
     */
    retreat() {
        let speed = Math.abs(this.x - this.xStart);
        const incline = Math.abs(this.y / speed);
        speed /= 40;
        this.moveIntervalId = setInterval(() => {
            this.retreatX(speed);
            this.retreatY(incline, speed);
            if (this.x == this.xStart && this.y == 0) {
                this.restartCycle();
            }
        }, 1000 / 60);
    }


    /**
     * retreat movement along x axis
     * @param {Number} speed - movement speed 
     */
    retreatX(speed) {
        if (this.x <= this.xStart - speed) {
            this.x += speed;
        } else if (this.x >= this.xStart + speed) {
            this.x -= speed;
        } else {
            this.x = this.xStart;
        }
    }


    /**
     * retreat movement along y axis
     * @param {Number} incline - ratio of effective y speed to x speed
     * @param {Number} speed - x movement speed 
     */
    retreatY(incline, speed) {
        if (this.y <= -speed) {
            this.y += speed * incline;
        } else if (this.y >= speed) {
            this.y -= speed * incline;
        } else {
            this.y = 0;
        }
    }


    /**
     * restart main cycle
     */
    restartCycle() {
        clearInterval(this.moveIntervalId);
        this.state = '';
        this.setCycle(0, 0);
    }


    /** 
     * die (causing game win)
     */
    die() {
        if (this.state != 'dead') {
            this.state = 'dead';
            this.clearAllIntervals();
            this.playAnimationOnceWithSound('die', 1000 / 12);
            this.endBossMusic();
            setTimeout(() => {
                world.win();
                this.clearAllIntervals();
            }, 1000);
        }
    }


    /**
     * change music back to main track
     */
    endBossMusic() {
        music['boss'].pause();
        music['main'].currentTime = 0;
        music['main'].play();
    }
}