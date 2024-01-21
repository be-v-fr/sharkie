class Movable extends Visible {
    speedY = 0;
    xStart;
    speedSinking = 1.4;
    acceleration = 0.08;
    health = 100;
    lastHit;
    speed = 0;
    imageCache = {};
    currentImg = 0;
    state = '';
    animateIntervalId;
    moveIntervalId;
    otherDirection = false;
    sounds = {};

    constructor() {
        super();
    }

    loadImages(name, dir, numberOfSprites) {
        this.imageCache[name] = [];
        for (let i = 1; i <= numberOfSprites; i++) {
            const path = dir + i + '.png';
            let img = new Image();
            img.src = path;
            this.imageCache[name].push(img);
        }
    }

    animate(name) {
        const numberOfSprites = this.imageCache[name].length;
        this.currentImg = 0;
        this.animateIntervalId = setInterval(() => {
            this.currentImg %= numberOfSprites;
            this.img = this.imageCache[name][this.currentImg];
            this.currentImg++;
        }, 1000 / 8);
    }

    moveX(speed) {
        if(this.otherDirection) {
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
            if (this.isAboveGround() || this.speedY < 0 || (this.isAboveGround() && this.speedY > this.speedSinking)) {
                this.y += this.speedY;
                this.sink();
            }
        }, 1000 / 60);
    }

    isAboveGround() { // später für Hindernisse anpassen ODER über Kollisionsmethode regeln
        return this.y < 240;
    }

    sink() {
        if (this.speedY <= this.speedSinking) {
            this.speedY += this.acceleration;
        } else {
            this.speedY -= this.acceleration;
        }
    }

    swimY(up) {
        // Sound einfügen
        const speed = 3;
        if (up) {
            if (this.y > -20) {
                this.speedY = -speed;
            }
        } else {
            this.speedY = speed * 1.1;
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
        if(this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime(); // timestamp-Methode schon implementiert (bei idleSince)??
        }
        // HEALTHBAR AKTUALISIEREN


        // Animation Verletzung
        // GENERELL ZU ANIMATIONEN: ERSTELLEN UND LÖSCHEN VON INTERVALLEN
        // ERSETZEN DURCH VERZWEIGUNGEN INNERHALB EINES INTERVALLS
    }

    isHurt() {
        let hitSince = new Date().getTime() - this.lastHit;
        return hitSince < 1000;
    }

    isDead() {
        return this.health == 0;
    }
}