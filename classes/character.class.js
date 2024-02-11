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
     * Konstruktor
     */
    constructor() {
        super().loadImage('../img/sharkie/1.IDLE/1.png');
        this.xStart = 140;
        this.x = this.xStart;
        this.y = 100;
        this.damage = 6;
        this.recoveryDuration = 1000;
        this.initFrame(30, 108, 90, 60);
        this.swimAndSinkY();
        this.loadAllImages();
        this.animate('idle');
        this.loadAllSounds();
    }


    /**
     * sämtliche Sprites laden
     */
    loadAllImages() {
        this.loadImages('idle', '../img/sharkie/1.IDLE/', 18);
        this.loadImages('rest', '../img/sharkie/2.LONG_IDLE/I', 14);
        this.loadImages('swim', '../img/sharkie/3.SWIM/', 6);
        this.loadImages('bubble normal', '../img/sharkie/4.Attack/normal_bubble/', 8);
        this.loadImages('bubble toxic', '../img/sharkie/4.Attack/toxic_bubble/', 8);
        this.loadImages('no toxic', '../img/sharkie/4.Attack/toxic_bubble/empty/', 8);
        this.loadImages('slap', '../img/sharkie/4.Attack/Fin slap/', 8);
        this.loadImages('hurt', '../img/sharkie/5.Hurt/1.Poisoned/', 5);
        this.loadImages('shocked', '../img/sharkie/5.Hurt/2.Shocked/', 3);
        this.loadImages('die normal', '../img/sharkie/6.Dead/1.Poisoned/', 12);
        this.loadImages('die shocked', '../img/sharkie/6.Dead/2.Shocked/', 10);
    }


    /**
     * sämtliche Sounds laden
     */
    loadAllSounds() {
        this.sounds = {
            'swimming': new Audio('../audio/sharkie_swim.mp3'),
            'swim up': new Audio('../audio/sharkie_swim_up.mp3'),
            'swim down': new Audio('../audio/sharkie_swim_down.mp3'),
            'hurt': new Audio('../audio/sharkie_hurt.mp3'),
            'shocked': new Audio('../audio/sharkie_shocked.mp3'),
            'die': new Audio('../audio/sharkie_die.mp3'),
            'die shocked': new Audio('../audio/sharkie_die_shocked.mp3'),
            'snoring': new Audio('../audio/sharkie_long_idle.mp3'),
            'slap': new Audio('../audio/sharkie_slap.mp3')
        };
        this.sounds['hurt'].volume = 0.5;
    }


    /**
     * Handlung nach Keyboardabfrage ausführen
     */
    act() {
        let key = world.keyboard;
        this.actLeftRight(key);
        this.actUpDown(key);
        this.actOther(key);
        this.actNone(key);
    }


    /**
     * Handlungen links und rechts
     * @param {object} key - Keyboard-Objekt 
     */
    actLeftRight(key) {
        if (key.RIGHT && !key.LEFT && this.state != 'swim blocked right') {
            if (this.state != 'swim right') {
                this.swim(true);
            }
            if (this.crossesRightMargin()) {
                this.block(true);
            }
        } else if (key.LEFT && !key.RIGHT && this.state != 'swim blocked left') {
            if (this.state != 'swim left') {
                this.swim(false);
            }
            if (this.crossesLeftMargin()) {
                this.block(false);
            }
        }
    }


    /**
     * Überprüfung, ob rechter Level-Rand erreicht wurde
     * @returns {boolean} - Level-Rand erreicht?
     */
    crossesRightMargin() {
        return world.bossFight && this.x >= world.boss.xStart + 212;
    }


    /**
     * Überprüfung, ob linker Level-Rand erreicht wurde (bewegt sich mit Spielfortschritt nach rechts)
     * @returns {boolean} - Level-Rand erreicht?
     */
    crossesLeftMargin() {
        return this.x < 50 || (world.bossFight && this.x <= world.boss.xStart - 388);
    }


    /**
     * Handlungen oben und unten
     * @param {object} key - Keyboard-Objekt 
     */
    actUpDown(key) {
        if (key.UP) {
            this.swimY(true);
        } else if (key.DOWN) {
            this.swimY(false);
        }
    }


    /**
     * Handlungen ohne bestimmte Richtung
     * @param {object} key - Keyboard-Objekt 
     */
    actOther(key) {
        if (key.SPACE && Date.now() - this.lastBubble > 750 && !this.state.includes('attacking')) {
            this.state = this.state + 'attacking';
            if (key.X) {
                this.bubble(true);
            } else {
                this.selectAttack();
            }
        }
    }


    /**
     * Automatische Auswahl der Attacke
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
     * Handlungen ohne Tastendruck
     * @param {object} key - Keyboard-Objekt 
     */
    actNone(key) {
        if (this.state != 'rest' && this.state != 'hit' && this.state != 'dead') {
            if (this.noKey(key) && this.state != 'idle') {
                this.idle();
            } else if (Date.now() - this.idleSince > 4000) {
                this.rest();
            }
        }
    }


    /**
     * Abfrage, ob keine Taste gedrückt wird
     * @param {object} key - Keyboard-Objekt 
     * @returns {boolean} - keine Taste gedrückt?
     */
    noKey(key) {
        return !key.RIGHT && !key.LEFT && !key.UP && !key.DOWN && !key.SPACE;
    }


    /**
     * Status resetten
     */
    clearState() {
        if (this.state == 'rest') {
            this.clearRest();
        }
        this.idleSince = Date.now() * 2;
        this.clearIntervals();
    }


    /**
     * Schlafmodus beenden
     */
    clearRest() {
        this.sounds['snoring'].loop = false;
        this.sounds['snoring'].pause();
        this.sounds['snoring'].currentTime = 0;
    }


    /**
     * Schwimmaktion horizontal
     * @param {boolean} right - Richtung (true = rechts, false = links) 
     */
    swim(right) {
        this.clearState();
        this.otherDirection = !right;
        this.animate('swim');
        this.moveX(this.speed);
        this.playSound('swimming');
        if (right) {
            this.state = 'swim right';
        } else {
            this.state = 'swim left';
        }
    }


    /**
     * Schwimmaktion vertikal
     * @param {boolean} up - Richtung (true = oben, false = unten) 
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
            this.animate('swim');
            this.state = 'swim';
        }
    }


    /**
     * nach oben schwimmen
     * @param {number} speed - Tempo
     */
    swimUp(speed) {
        if (this.speedY >= -speed * 0.9) {
            this.playSound('swim up');
        }
        this.speedY = -speed;
    }


    /**
     * nach unten schwimmen
     * @param {number} speed - Tempo
     */
    swimDown(speed) {
        if (this.speedY <= speed * 0.7) {
            this.playSound('swim down');
        }
        this.speedY = speed * 0.8;
    }

    block(right) {
        clearInterval(this.moveIntervalId);
        if (right) {
            this.state = 'swim blocked right';
        } else {
            this.state = 'swim blocked left';
        }
    }

    idle() {
        this.clearState();
        this.animate('idle');
        this.idleSince = Date.now();
        this.state = 'idle';
    }

    rest() {
        this.clearState();
        this.animate('rest');
        this.state = 'rest';
        this.sounds['snoring'].loop = true;
        this.playSound('snoring');
    }

    bubble(isToxic) {
        if (isToxic && this.poison == 0) {
            this.playAnimationOnce('no toxic');
            this.newBubbleAfterTimeout(false, isToxic);
        } else {
            if (isToxic) {
                this.poison -= 20;
                world.stats[2].update(this.poison);
                this.playAnimationOnce('bubble toxic');
            } else {
                this.playAnimationOnce('bubble normal');
            }
            this.newBubbleAfterTimeout(true, isToxic);
        }
        this.idle();
    }

    slap() {
        if (!this.slapping) {
            this.slapping = true;
            this.playAnimationOnce('slap');
            setTimeout(() => {
                if (this.slapping) {
                    this.playSound('slap');
                    this.slapping = false;
                }
                this.removeAttackFromState();
            }, 450);
        }
    }

    removeAttackFromState() {
        if (this.state.includes('attacking')) {
            this.state.slice(0, -10);
        }
    }

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

    reactToHit(obj) {
        if (!this.isDead()) {
            if (obj instanceof Jellyfish && obj.color == 'green') {
                this.playAnimationOnce('shocked');
                this.playSound('shocked');
            } else {
                this.playAnimationOnce('hurt');
                this.playSound('hurt');
            }
            this.animate('idle');
            this.recover();
        }
    }

    bounce(obj) {
        let bouncing = false;
        for (let i = 0; i < obj.frames.length; i++) {
            const x = this.getBounceX(obj, this.frames[0], obj.frames[i]);
            const y = this.getBounceY(obj, this.frames[0], obj.frames[i]);
            if (this.bounceX(x) || this.bounceY(y)) {
                bouncing = true;
            }
        }
        if (!bouncing) {
            this.bounceException();
        }
    }

    bounceX(right) {
        if (right != null) {
            this.bounceXPosition(right);
            clearInterval(this.moveIntervalId);
            this.otherDirection = !right;
            this.moveX(this.speed / 4);
            return true;
        }
    }

    bounceXPosition(right) {
        if (right) {
            this.x += 12;
            if (this.crossesRightMargin()) {
                this.x -= 12;
            }
        } else {
            this.x -= 12;
            if (this.crossesLeftMargin()) {
                this.x += 12;
            }
        }
    }

    bounceY(down) {
        if (down != null) {
            if (down) {
                this.y += 20;
            } else {
                this.y -= 20;
            }
            return true;
        }
    }

    getBounceX(obj, frameThis, frameObj) {
        if (this.frameCollision(obj, frameThis, frameObj)) {
            const thisLeftEdge = this.x + frameThis[0];
            const objLeftEdge = obj.x + frameObj[0];
            if (thisLeftEdge <= objLeftEdge) {
                return false;
            } else if (thisLeftEdge + frameThis[2] >= objLeftEdge + frameObj[2]) {
                return true;
            }
        } else {
            return null;
        }
    }

    getBounceY(obj, frameThis, frameObj) {
        if (this.frameCollision(obj, frameThis, frameObj)) {
            const thisUpperEdge = this.y + frameThis[1];
            const objUpperEdge = obj.y + frameObj[1];
            if (thisUpperEdge <= objUpperEdge) {
                return false;
            } else if (thisUpperEdge + frameThis[3] >= objUpperEdge + frameObj[3]) {
                return true;
            }
        } else {
            return null;
        }
    }

    bounceException() {
        this.x -= 100;
        this.y = 100;
    }

    recover() {
        setTimeout(() => {
            world.keyboard.toggleControls(false);
            this.idle();
        }, 400);
    }

    newBubbleAfterTimeout(isAttacking, isToxic) {
        setTimeout(() => {
            if (isAttacking && this.state != 'hit' && !this.isDead()) {
                if (this.otherDirection) {
                    world.bubbles.push(new Bubble(this.x + 8, this.y + 120, isToxic, this.otherDirection));
                } else {
                    world.bubbles.push(new Bubble(this.x + 110, this.y + 120, isToxic, this.otherDirection));
                }
            }
            this.removeAttackFromState();
        }, 640);
        this.lastBubble = Date.now();
    }

    collectItem(item) {
        item.playSound('collect');
        if (item instanceof Coin) {
            this.collectCoin();
        } else {
            this.collectPhial();
        }
    }

    collectCoin() {
        this.coins++;
        const progress = 100 * this.coins / world.numberOfCoins;
        world.stats[1].update(progress);
    }

    collectPhial() {
        if (this.poison <= 80) {
            this.poison += 20;
            world.stats[2].update(this.poison);
        }
    }

    die(obj) {
        this.state = 'dead';
        if (obj instanceof Jellyfish && obj.color == 'green') {
            this.playSound('shocked');
            this.playAnimationOnce('die shocked');
            this.playSoundAfterDelay(500, 'die shocked');
        } else {
            this.playAnimationOnce('die normal');
            this.playSoundAfterDelay(200, 'die');
        }
        setTimeout(() => {
            world.lose();
        }, 1000);
    }
}