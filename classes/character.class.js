class Character extends Movable {
    width = 150;
    height = 225;
    speed = 3;
    world;
    idleSince;

    constructor() {
        super().loadImage('../img/sharkie/1.IDLE/1.png');
        this.xStart = 140;
        this.x = this.xStart;
        this.y = 100;
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
        if (key.RIGHT && !key.LEFT) {
            if (this.state != 'swim right') {
                this.swim(true);
            } // else: if( rechter Level-Rand ) { ... }
        } else {
            if (key.LEFT && !key.RIGHT && this.state != 'swim blocked') {
                if (this.state != 'swim left') {
                    this.swim(false);
                }
                if (this.x < 50) {
                    this.block();
                }
            }
        }
        if (this.state != 'rest') {
            if (!key.RIGHT && !key.LEFT && this.state != 'idle') {
                this.idle();
            } else {
                if (Date.now() - this.idleSince > 4000) {
                    this.rest();
                }
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
        if(right) {
            this.state = 'swim right';
        } else {
            this.state = 'swim left';
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

    jump() {

    }
}