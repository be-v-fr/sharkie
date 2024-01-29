class Character extends Movable {
    width = 150;
    height = 225;
    world;
    poison = 40;
    coins = 0;
    speed = 3;
    idleSince;
    lastBubble = 0;

    constructor() {
        super().loadingNow('character');
        this.loadImage('../img/sharkie/1.IDLE/1.png');
        this.xStart = 140;
        this.x = this.xStart;
        this.y = 100;
        this.initFrame(30, 108, 90, 60);
        this.swimAndSinkY();
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
        this.animate('idle');
        this.sounds = {
            'swimming': new Audio('../audio/sharkie_swim.mp3'),
            'hurt': new Audio('../audio/sharkie_hurt.mp3'),
            'shocked': new Audio('../audio/sharkie_shocked.mp3')
        };
    }

    act() {
        let key = this.world.keyboard;
        this.actLeftRight(key);
        this.actUpDown(key);
        this.actOther(key);
        this.actNone(key);
    }

    actLeftRight(key) {
        if (key.RIGHT && !key.LEFT) {
            if (this.state != 'swim right') {
                this.swim(true);
            } // else: if( rechter Level-Rand ) { ... }
        } else if (key.LEFT && !key.RIGHT && this.state != 'swim blocked') {
            if (this.state != 'swim left') {
                this.swim(false);
            }
            if (this.x < 50) {
                this.blocked();
            }
        }
    }

    actUpDown(key) {
        if (key.UP) {
            this.swimY(true);
        } else if (key.DOWN) {
            this.swimY(false);
        }
    }

    actOther(key) {
        if (key.SPACE && Date.now() - this.lastBubble > 750) {
            this.attack(key.X);
        }
    }

    actNone(key) {
        if (this.state != 'rest' && this.state != 'hit' && this.state != 'dead') {
            if (this.noKey(key) && this.state != 'idle') {
                this.idle();
            } else if (Date.now() - this.idleSince > 4000) {
                this.rest();
            }
        }
    }

    noKey(key) {
        return !key.RIGHT && !key.LEFT && !key.UP && !key.DOWN && !key.SPACE;
    }

    clearState() {
        this.idleSince = Date.now() * 2; // timestamp in ferner Zukunft
        this.clearIntervals();
    }

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

    swimY(up) {
        // Sound einfügen
        const speed = 3;
        if (up) {
            this.speedY = -speed;
        } else {
            this.speedY = speed * 0.8;
        }
    }

    blocked() {
        clearInterval(this.moveIntervalId);
        this.state = 'swim blocked';
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
    }

    attack(isToxic) {
        if (isToxic && this.poison == 0) {
            this.playAnimationOnce('no toxic');
            this.newBubbleAfterTimeout(false, isToxic);
        } else {
            if (isToxic) {
                this.poison -= 20;
                this.world.stats[2].update(this.poison);
                this.playAnimationOnce('bubble toxic');
            } else {
                this.playAnimationOnce('bubble normal');
            }
            this.newBubbleAfterTimeout(true, isToxic);
        }
        this.idle();
    }

    hurt(obj) {
        if (this.state != 'dead') {
            if (this.state != 'hit') {
                this.clearState();
                this.state = 'hit';
                if (obj instanceof Jellyfish && obj.color == 'green') {
                    this.playSound('shocked');
                } else {
                    this.playSound('hurt');
                }            
            }
            this.world.keyboard.toggleControls(true);
            this.hit(obj);
            this.reactToHit(obj);
        }
    }

    reactToHit(obj) {
        if (this.state != 'dead') {
            this.bounce(obj);
            if (obj instanceof Jellyfish && obj.color == 'green') {
                this.playAnimationOnce('shocked');
            } else {
                this.playAnimationOnce('hurt');
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
            if(this.bounceX(x) || this.bounceY(y)) {
                bouncing = true;
            }
        }
        if (!bouncing) {
            this.bounceException();
        }
    }

    bounceX(right) {
        if (right != null) {
            if (right) {
                this.x += 12;
            } else {
                this.x -= 12;
            }
            clearInterval(this.moveIntervalId);
            this.otherDirection = !right;
            this.moveX(this.speed / 4);
            return true;
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
            this.world.keyboard.toggleControls(false);
            this.idle();
        }, 400);
    }

    isRecovered() {
        return this.state != 'hit' || Date.now() - this.lastHit > 1000;
    }

    newBubbleAfterTimeout(isAttacking, isToxic) {
        setTimeout(() => {
            if (isAttacking) {
                if (this.otherDirection) {
                    world.bubbles.push(new Bubble(this.x + 8, this.y + 120, isToxic, this.otherDirection));
                } else {
                    world.bubbles.push(new Bubble(this.x + 110, this.y + 120, isToxic, this.otherDirection));
                }
            }
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
        const progress = 100 * this.coins / this.world.numberOfCoins;
        this.world.stats[1].update(progress);
    }

    collectPhial() {
        if (this.poison <= 80) {
            this.poison += 20;
            this.world.stats[2].update(this.poison);
        }
    }

    die(obj) {
        this.state = 'dead';
        if (obj instanceof Jellyfish && obj.color == 'green') {
            this.playAnimationOnce('die shocked');
        } else {
            this.playAnimationOnce('die normal');
        }
        setTimeout(() => { this.world.stop = true; }, 1000);
    }
}