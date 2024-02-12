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
        this.animate('idle');
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
     * @param {Object} key - Keyboard-Objekt 
     */
    actLeftRight(key) {
        if (key.RIGHT && !key.LEFT && this.state != 'swim blocked right') {
            this.actLeft();
        } else if (key.LEFT && !key.RIGHT && this.state != 'swim blocked left') {
            this.actRight();
        }
    }


    /**
     * Handlungsausführung links
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
     * Handlungsausführung rechts
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
     * Überprüfung, ob rechter Level-Rand erreicht wurde
     * @returns {Boolean} - Level-Rand erreicht?
     */
    crossesRightMargin() {
        return world.bossFight && this.x >= world.boss.xStart + 212;
    }


    /**
     * Überprüfung, ob linker Level-Rand erreicht wurde (bewegt sich mit Spielfortschritt nach rechts)
     * @returns {Boolean} - Level-Rand erreicht?
     */
    crossesLeftMargin() {
        return this.x < 50 || (world.bossFight && this.x <= world.boss.xStart - 388);
    }


    /**
     * Handlungen oben und unten
     * @param {Object} key - Keyboard-Objekt 
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
     * @param {Object} key - Keyboard-Objekt 
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
     * @param {Object} key - Keyboard-Objekt 
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
     * @param {Object} key - Keyboard-Objekt 
     * @returns {Boolean} - keine Taste gedrückt?
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
     * @param {Boolean} right - Richtung (true = rechts, false = links) 
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
     * @param {Boolean} up - Richtung (true = oben, false = unten) 
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
     * @param {Number} speed - Tempo
     */
    swimUp(speed) {
        if (this.speedY >= -speed * 0.9) {
            this.playSound('swim up');
        }
        this.speedY = -speed;
    }


    /**
     * nach unten schwimmen
     * @param {Number} speed - Tempo
     */
    swimDown(speed) {
        if (this.speedY <= speed * 0.7) {
            this.playSound('swim down');
        }
        this.speedY = speed * 0.8;
    }


    /**
     * Bewegung blockieren
     * @param {Boolean} right - Richtung (true = rechts, false = links) 
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
     * keine Aktion ausführen
     */
    idle() {
        this.clearState();
        this.animate('idle');
        this.idleSince = Date.now();
        this.state = 'idle';
    }


    /**
     * in Schlafmodus übergehen
     */
    rest() {
        this.clearState();
        this.animate('rest');
        this.state = 'rest';
        this.sounds['snoring'].loop = true;
        this.playSound('snoring');
    }


    /**
     * Bubble abfeuern
     * @param {Boolean} isToxic - Art der Bubble (true = giftig, false = normal)  
     */
    bubble(isToxic) {
        if (isToxic && this.poison == 0) {
            this.failBubbleAttack()
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


    /**
     * bei giftiger Bubble-Attacke scheitern (da Poison leer)
     */
    failBubbleAttack() {
        this.playAnimationOnce('no toxic');
        this.newBubbleAfterTimeout(false, true);
    }


    /**
     * Bubble nach Verzögerung abfeuern
     * @param {Boolean} isAttacking - Attacke ausführen (true) oder abbrechen (false)
     * @param {Boolean} isToxic - Art der Bubble (true = giftig, false = normal)  
     */
    newBubbleAfterTimeout(isAttacking, isToxic) {
        setTimeout(() => {
            if (isAttacking && this.state != 'hit' && !this.isDead()) {
                this.createBubbleObject(isToxic);
            }
            this.removeAttackFromState();
        }, 640);
        this.lastBubble = Date.now();
    }


    /**
     * Bubble-Objekt erzeugen und zu world.bubbles hinzufügen
     * @param {Boolean} isToxic - Art der Bubble (true = giftig, false = normal)  
     */
    createBubbleObject(isToxic) {
        if (this.otherDirection) {
            world.bubbles.push(new Bubble(this.x + 8, this.y + 120, isToxic, this.otherDirection));
        } else {
            world.bubbles.push(new Bubble(this.x + 110, this.y + 120, isToxic, this.otherDirection));
        }
    }


    /**
     * Slap-Attacke einmalig ausführen
     */
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


    /**
     * Attacke aus Status löschen
     */
    removeAttackFromState() {
        if (this.state.includes('attacking')) {
            this.state.slice(0, -10);
        }
    }


    /**
     * Character verletzt sich
     * @param {Object} obj - Objekt, das Verletzung ausgelöst hat 
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
     * Character reagiert objektabhängig auf Verletzung
     * @param {Object} obj - Objekt, das Verletzung ausgelöst hat 
     */
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


    /**
     * von Objekt abprallen
     * @param {Object} obj - Objekt der Kollision
     */
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


    /**
     * in x-Richtung abprallen
     * @param {Boolean} right - Richtung (true = rechts, false = links) 
     * @returns {Boolean} true, falls ein Abprallen in x-Richtung geschieht 
     */
    bounceX(right) {
        if (right != null) {
            this.bounceXPosition(right);
            clearInterval(this.moveIntervalId);
            this.otherDirection = !right;
            this.moveX(this.speed / 4);
            return true;
        }
    }


    /**
     * x-Verschiebung durch horizontales Abprallen, unter Berücksichtigung des Level-Rands
     * @param {Boolean} right - Richtung (true = rechts, false = links) 
     */
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


    /**
     * in y-Richtung abprallen
     * @param {Boolean} down - Richtung (true = unten, false = oben) 
     * @returns {Boolean} true, falls ein Abprallen in y-Richtung geschieht 
     */
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


    /**
     * horizontale Abprallrichtung bestimmen
     * @param {Object} obj - Objekt der Kollision 
     * @param {Array} frameThis - Offset-Frame des Characters
     * @param {Array} frameObj - Offset-Frame des kollidierenden Objekts
     * @returns {Boolean} true = nach rechts, false = nach links, null = keine x-Bewegung
     */
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


    /**
     * vertikale Abprallrichtung bestimmen
     * @param {Object} obj - Objekt der Kollision 
     * @param {Array} frameThis - Offset-Frame des Characters
     * @param {Array} frameObj - Offset-Frame des kollidierenden Objekts
     * @returns {Boolean} true = nach unten, false = nach oben, null = keine y-Bewegung
     */
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


    /**
     * Abprall-Ausnahme (falls das Abprallen zu weit in eine neue Kollision hineinführt)
     */
    bounceException() {
        this.x -= 100;
        this.y = 100;
    }


    /**
     * von Verletzung erholen
     */
    recover() {
        setTimeout(() => {
            world.keyboard.toggleControls(false);
            this.idle();
        }, 400);
    }


    /**
     * sterben
     * @param {Object} obj - Objekt, das den Tod ausgelöst hat 
     */
    die(obj) {
        super.die();
        if (obj instanceof Jellyfish && obj.color == 'green') {
            this.playSound('shocked');
            this.playAnimationOnce('die shocked');
            this.playSoundAfterDelay(500, 'die shocked');
        } else {
            this.playAnimationOnce('die normal');
            this.playSoundAfterDelay(200, 'die');
        }
        setTimeout(() => world.lose(), 1000);
    }
}