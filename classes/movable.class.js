class Movable extends Visible {
    speedY = 0;
    speedSinking = 1.4;
    acceleration = 0.08;
    health = 100;
    lastHit;

    constructor() {
        super();
    }

    moveRight() {
        console.log('moving right');
    }

    moveLeft() {
        console.log('moving left');
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