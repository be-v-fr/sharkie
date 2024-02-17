class Character extends Movable {
    width = 150;
    height = 225;
    poison = 40;
    coins = 0;
    speed = 3;
    idleSince;
    lastBubble = 0;
    slapping = false;

    /**
     * constructor
     */
    constructor() {
        super().loadImage('./img/sharkie/idle/1.png');
        this.xStart = 140;
        this.x = this.xStart;
        this.y = 100;
        this.damage = 6;
        this.recoveryDuration = 1000;
        this.initFrame(30, 108, 90, 60);
        this.swimAndSinkY();
        this.sounds['hurt'].volume = 0.5;
        this.sounds['snoring'].loop = true;
    }


    /**
     * left arrow key actions
     */
    actLeft() {
        if (this.state != 'swim right') {
            this.swim(true);
        }
        if (this.crossesRightMargin()) {
            this.block(true);
        }
    }


    /**
     * right arrow key actions
     */
    actRight() {
        if (this.state != 'swim left') {
            this.swim(false);
        }
        if (this.crossesLeftMargin()) {
            this.block(false);
        }
    }


    /**
     * check if right level end has been crossed
     * @returns {Boolean} - has the level end been crossed?
     */
    crossesRightMargin() {
        return world.bossFight && this.x >= world.boss.xStart + 212;
    }


    /**
     * check if left margin has been crossed (margin moves right with level progress)
     * @returns {Boolean} - has the margin been crossed?
     */
    crossesLeftMargin() {
        return this.x < 50 || (world.bossFight && this.x <= world.boss.xStart - 388);
    }


    /**
     * automatic attack selection
     */
    selectAttack() {
        let threshold = 96;
        let close = world.enemies.filter(e => this.checkVerticalOverlap(e) && e.state != 'dead');
        if (this.otherDirection) {
            close = close.filter(e => this.checkDistanceLeft(e, threshold));
        } else {
            close = close.filter(e => this.checkDistanceRight(e, threshold));
        }
        if (close.length == 0) {
            this.bubble(false);
        } else {
            this.slap();
        }
    }


    /**
     * reset character state
     */
    clearState() {
        if (this.state == 'rest') {
            this.clearRest();
        }
        this.idleSince = Date.now() * 2;
        this.clearIntervals();
    }


    /**
     * end character sleep mode
     */
    clearRest() {
        this.sounds['snoring'].pause();
        this.sounds['snoring'].currentTime = 0;
    }


    /**
     * swim horizontally
     * @param {Boolean} right - direction (true = right, false = left) 
     */
    swim(right) {
        this.clearState();
        this.otherDirection = !right;
        this.animate('swim', 1000 / 8);
        this.moveX(this.speed);
        this.playSound('swimming');
        if (right) {
            this.state = 'swim right';
        } else {
            this.state = 'swim left';
        }
    }


    /**
     * swim vertically
     * @param {Boolean} up - direction (true = up, false = down) 
     */
    swimY(up) {
        const speed = 3;
        if (up) {
            this.swimUp(speed);
        } else {
            this.swimDown(speed);
        }
        if (!this.state.includes('swim')) {
            this.clearState();
            this.animate('swim', 1000 / 8);
            this.state = 'swim';
        }
    }


    /**
     * swim up
     * @param {Number} speed - swimming speed
     */
    swimUp(speed) {
        if (this.speedY >= -speed * 0.9) {
            this.playSound('swim up');
        }
        this.speedY = -speed;
    }


    /**
     * swim down
     * @param {Number} speed - swimming speed
     */
    swimDown(speed) {
        if (this.speedY <= speed * 0.7) {
            this.playSound('swim down');
        }
        this.speedY = speed * 0.8;
    }


    /**
     * block swimming
     * @param {Boolean} right - direction (true = right, false = left) 
     */
    block(right) {
        clearInterval(this.moveIntervalId);
        if (right) {
            this.state = 'swim blocked right';
        } else {
            this.state = 'swim blocked left';
        }
    }


    /**
     * perform no action
     */
    idle() {
        this.clearState();
        this.animate('idle', 1000 / 8);
        this.idleSince = Date.now();
        this.state = 'idle';
    }


    /**
     * fall asleep
     */
    rest() {
        this.clearState();
        this.playAnimationOnce('fall asleep', 1000 / 6);
        this.animate('sleep', 1000 / 2);
        this.state = 'rest';
        setTimeout(() => {
            if (this.state = 'rest') {
                this.playSound('snoring');
            }
        }, 1250);
    }


    /**
     * shoot bubble
     * @param {Boolean} isToxic - bubble type (true = toxic, false = normal)  
     */
    bubble(isToxic) {
        if (isToxic && this.poison == 0) {
            this.failBubbleAttack()
        } else {
            if (isToxic) {
                this.poison -= 20;
                world.stats[2].update(this.poison);
                this.playAnimationOnce('bubble toxic', 1000 / 12);
            } else {
                this.playAnimationOnce('bubble normal', 1000 / 12);
            }
            this.newBubbleAfterTimeout(isToxic);
        }
        this.idle();
    }


    /**
     * fail toxic bubble attack (because character is out of poison)
     */
    failBubbleAttack() {
        this.playAnimationOnce('no toxic', 1000 / 12);
        setTimeout(() => {
            this.removeAttackFromState();
        }, 640);
    }


    /**
     * shoot bubble after delay
     * @param {Boolean} isToxic - bubble type (true = toxic, false = normal)  
     */
    newBubbleAfterTimeout(isToxic) {
        setTimeout(() => {
            if (this.state != 'hit' && !this.isDead()) {
                this.createBubbleObject(isToxic);
            }
            this.removeAttackFromState();
        }, 640);
        this.lastBubble = Date.now();
    }


    /**
     * create bubble object and add to world.bubbles array
     * @param {Boolean} isToxic - bubble type (true = toxic, false = normal)
     */
    createBubbleObject(isToxic) {
        if (this.otherDirection) {
            world.bubbles.push(new Bubble(this.x + 8, this.y + 120, isToxic, this.otherDirection));
        } else {
            world.bubbles.push(new Bubble(this.x + 110, this.y + 120, isToxic, this.otherDirection));
        }
    }


    /**
     * perform slap attack once
     */
    slap() {
        if (!this.slapping) {
            this.slapping = true;
            this.playAnimationOnce('slap', 1000 / 12);
            this.playSoundAfterDelay(300, 'slap');
            setTimeout(() => {
                this.slapping = false;
                this.removeAttackFromState();
            }, 750);
        }
    }


    /**
     * clear attack from state string
     */
    removeAttackFromState() {
        if (this.state.includes('attacking')) {
            this.state.slice(0, -10);
        }
    }


    /**
     * character is being hurt
     * @param {Object} obj - damage cause
     */
    hurt(obj) {
        if (!this.isDead()) {
            if (this.state != 'hit') {
                this.hit(obj);
                this.clearState();
                this.state = 'hit';
                this.reactToHit(obj);
            }
            world.keyboard.toggleControls(true);
            this.bounce(obj);
        }
    }


    /**
     * reaction to being hit, depending on object type causing the damage
     * @param {Object} obj - damage cause
     */
    reactToHit(obj) {
        if (!this.isDead()) {
            if (obj instanceof Jellyfish && obj.color == 'green') {
                this.playAnimationOnceWithSound('shocked', 1000 / 12);
            } else {
                this.playAnimationOnceWithSound('hurt', 1000 / 12);
            }
            this.animate('idle', 1000 / 8);
            this.recover();
        }
    }


    /**
     * recover from hit
     */
    recover() {
        setTimeout(() => {
            world.keyboard.toggleControls(false);
            this.idle();
        }, 400);
    }


    /**
     * die
     * @param {Object} obj - damage cause resulting in death
     */
    die(obj) {
        super.die();
        if (obj instanceof Jellyfish && obj.color == 'green') {
            this.playSound('shocked');
            this.playAnimationOnce('die shocked', 1000 / 12);
            this.playSoundAfterDelay(500, 'die shocked');
        } else {
            this.playAnimationOnce('die normal', 1000 / 12);
            this.playSoundAfterDelay(200, 'die');
        }
        setTimeout(() => world.lose(), 1000);
    }
}