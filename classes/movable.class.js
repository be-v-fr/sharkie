class Movable extends Visible {
    speedY = 0;
    xStart;
    yMin = -100;
    yMax = 240;
    speedSinking = 1.4;
    acceleration = 0.1;
    health = 100;
    lastHit;
    speed = 0;
    moveIntervalId;
    otherDirection = false;
    sounds = {};

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

    playSound(sound) {
        this.sounds[sound].currentTime = 0;
        this.sounds[sound].play();
    }

    swimAndSinkY() {
        setInterval(() => {
            if (this.isBelowRoof() && this.isAboveGround()) {
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
        if (this.speedY <= this.speedSinking) {
            this.speedY += this.acceleration;
        } else {
            this.speedY -= this.acceleration;
        }
    }

    isColliding(obj) {
        const thisX = this.x + this.frame[0];
        const thisY = this.y + this.frame[1];
        const objX = obj.x + obj.frame[0];
        const objY = obj.y + obj.frame[1];
        return thisX + this.frame[2] >= objX && // Abstand nach rechts
            thisX <= objX + obj.frame[2] && // Abstand nach links
            thisY + this.frame[3] >= objY && // Abstand nach unten
            thisY <= objY + obj.frame[3]; // Abstand nach oben
    }

    hit(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }

        // Animation Verletzung
    }

    isHurt() {
        let hitSince = new Date().getTime() - this.lastHit;
        return hitSince < 1000;
    }

    isDead() {
        return this.health == 0;
    }
}