class Movable extends Visible {
    speedY = 0;
    xStart;
    yMin = -100;
    yMax = 280;
    speedSinking = 1.4;
    acceleration = 0.1;
    health = 100;
    lastHit = 0;
    speed = 0;
    moveIntervalId;
    otherDirection = false;
    sounds = {};
    damage;
    recoveryDuration;

    constructor() {
        super();
    }

    clearIntervals() {
        clearInterval(this.moveIntervalId);
        clearInterval(this.animateIntervalId);
    }

    moveX(speed) {
        if (this.otherDirection) {
            speed = -speed;
        }
        this.moveIntervalId = setInterval(() => {
            this.x += speed;
        }, 1000 / 60);
    }

    swimAndSinkY() {
        setInterval(() => {
            if (this.isBelowRoof() && this.isAboveGround() && this.state != 'hit') {
                this.y += this.speedY;
            } else {
                this.speedY = 0;
                // Sound für Kollision
                if (!this.isBelowRoof()) {
                    this.y = this.yMin;
                } else if (!this.isAboveGround()) {
                    this.y = this.yMax;
                }
            }
            this.sink();
        }, 1000 / 60);
    }

    isAboveGround() { // später für Hindernisse anpassen ODER über Kollisionsmethode regeln
        return this.y <= this.yMax;
    }

    isBelowRoof() {
        return this.y >= this.yMin;
    }

    sink() {
        if (this.state != 'hit') {
            if (this.speedY <= this.speedSinking) {
                this.speedY += this.acceleration;
            } else {
                this.speedY -= this.acceleration;
            }
        } else {
            this.speedY = 0;
        }
    }

    isColliding(obj) {
        let collision = false;
        this.frames.forEach(tF => {
            obj.frames.forEach(oF => {
                if (this.frameCollision(obj, tF, oF)) {
                    collision = true;
                }
            });
        });
        return collision;
    }

    frameCollision(obj, frameThis, frameObj) {
        return this.x + frameThis[0] + frameThis[2] >= obj.x + frameObj[0] &&
            this.x + frameThis[0] <= obj.x + frameObj[0] + frameObj[2] &&
            this.y + frameThis[1] + frameThis[3] >= obj.y + frameObj[1] &&
            this.y + frameThis[1] <= obj.y + frameObj[1] + frameObj[3];
    }

    checkVerticalOverlap(obj) {
        return this.y + this.frames[0][1] + this.frames[0][3] >= obj.y + obj.frames[0][1] &&
            this.y + this.frames[0][1] <= obj.y + obj.frames[0][1] + obj.frames[0][3];
    }

    checkDistanceLeft(obj, threshold) {
        const thisX = this.x + this.frames[0][0];
        const objX = obj.x + obj.frames[0][0] + obj.frames[0][2];
        return thisX > objX && thisX - objX < threshold;
    }

    checkDistanceRight(obj, threshold) {
        const thisX = this.x + this.frames[0][0] + this.frames[0][2];
        const objX = obj.x + obj.frames[0][0];
        return thisX < objX && objX - thisX < threshold;
    }

    hit(obj) {
        this.health -= obj.damage;
        if (this.health <= 0) {
            this.health = 0;
            this.die(obj);
        } else {
            if (this instanceof Boss) {
                this.bossHit();
            }
            this.lastHit = Date.now();
        }
    }

    canGetHit() {
        return !(this instanceof Boss) || this.isRecovered();
    }

    bossHit() {
        this.state = 'hit';
        this.hurt();
    }

    isRecovered() {
        return (!(this instanceof Boss) && this.state != 'hit' && this.state != 'dead') ||
            Date.now() - this.lastHit > this.recoveryDuration;
    }

    isDead() {
        return this.health == 0;
    }

    die() {
        this.state = 'dead';
    }
}