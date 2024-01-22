class Character extends Movable {
    width = 150;
    height = 225;
    world;
    poison = 40;
    speed = 3;
    idleSince;

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
        if (key.SPACE) {
            this.attack();
        }
    }

    actNone(key) {
        if (this.state != 'rest') {
            if (!key.RIGHT && !key.LEFT && this.state != 'idle') {
                this.idle();
            } else if (Date.now() - this.idleSince > 4000) {
                this.rest();
            }
        }
    }

    clearState() {
        this.idleSince = Date.now() * 2; // timestamp in ferner Zukunft
        clearInterval(this.moveIntervalId);
        clearInterval(this.animateIntervalId);
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

    attack() {
        // Animation etc.
        const isToxic = this.poison > 0;
        world.bubbles.push(new Bubble(this.x + 100, this.y + 130, isToxic));
        if (isToxic) {
            this.poison -= 20;
        }
    }
}