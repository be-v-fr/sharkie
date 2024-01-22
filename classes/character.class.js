class Character extends Movable {
    width = 150;
    height = 225;
    world;
    poison = 40;
    speed = 3;
    idleSince;
    lastBubble = 0;

    constructor() {
        super().loadImage('../img/sharkie/1.IDLE/1.png');
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
        this.animate('idle');
        this.sounds = {
            'swimming': new Audio('../audio/sharkie_swim.mp3')
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
                this.block();
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
        if (this.state != 'rest') {
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

    block() {
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
        if (this.poison == 0) {
            isToxic = false;
        }
        if (isToxic) {
            this.poison -= 20;
            this.playAnimationOnce('bubble toxic');
        } else {
            this.playAnimationOnce('bubble normal');
        }
        setTimeout(() => {
            if (this.otherDirection) {
                world.bubbles.push(new Bubble(this.x + 8, this.y + 120, isToxic, this.otherDirection));
            } else {
                world.bubbles.push(new Bubble(this.x + 110, this.y + 120, isToxic, this.otherDirection));
            }
        }, 660);
        this.lastBubble = Date.now();
        this.idle();
    }
}