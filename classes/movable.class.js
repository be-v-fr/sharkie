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

    /**
     * Konstruktor
     */
    constructor() {
        super();
        this.loadSounds();
    }


    /**
     * Sounds laden (mit Daten aus path.js)
     */
    loadSounds() {
        const classToString = this.constructor.name;
        if (SOUNDS[classToString]) {
            this.sounds = SOUNDS[classToString];
        }
    }


    /**
     * Schaden festlegen
     * @param {Number} normal - Schaden im normalen Modus
     * @param {Number} hard - Schaden im schweren Modus
     */
    setDamage(normal, hard) {
        if (settings['hardMode']) {
            this.damage = hard;
        } else {
            this.damage = normal;
        }
    }


    /**
     * Intervalle für Bewegung und Animation löschen
     */
    clearIntervals() {
        clearInterval(this.moveIntervalId);
        clearInterval(this.animateIntervalId);
    }


    /**
     * horizontal bewegen
     * @param {Number} speed - Betrag des Tempos 
     */
    moveX(speed) {
        if (this.otherDirection) {
            speed = -speed;
        }
        this.moveIntervalId = setInterval(() => {
            this.x += speed;
        }, 1000 / 60);
    }


    /**
     * vertikal schwimmen und sinken
     */
    swimAndSinkY() {
        setInterval(() => {
            if (this.isBelowRoof() && this.isAboveGround() && this.state != 'hit') {
                this.y += this.speedY;
            } else {
                this.restrictToYBoundaries();
            }
            this.sink();
        }, 1000 / 60);
    }


    /**
     * Abfrage, ob oberhalb von Boden
     * @returns {Boolean} true = oberhalb, false = unterhalb
     */
    isAboveGround() {
        return this.y <= this.yMax;
    }


    /**
     * Abfrage, ob unterhalb von Maximalhöhe
     * @returns {Boolean} true = unterhalb, false = oberhalb
     */
    isBelowRoof() {
        return this.y >= this.yMin;
    }


    /**
     * Überschreitung der y-Bewegungsgrenzen verhindern
     */
    restrictToYBoundaries() {
        this.speedY = 0;
        if (!this.isBelowRoof()) {
            this.y = this.yMin;
        } else if (!this.isAboveGround()) {
            this.y = this.yMax;
        }
    }


    /**
     * sinken
     */
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


    /**
     * Abfrage, ob eine Kollision mit einem anderen Objekt stattfindet
     * @param {Object} obj - Objekt der Kollision
     * @returns {Boolean} true = Kollision, false = keine Kollision
     */
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


    /**
     * Abfrage, ob Kollision zwischen Offset-Frames stattfindet
     * @param {Object} obj - Objekt der Kollision
     * @param {Array} frameThis - Offset-Frame dieses Objekts
     * @param {Array} frameObj - Offset-Frame des kollidierenden Objekts
     * @returns {Boolean} true = Kollision, false = keine Kollision
     */
    frameCollision(obj, frameThis, frameObj) {
        return this.x + frameThis[0] + frameThis[2] >= obj.x + frameObj[0] &&
            this.x + frameThis[0] <= obj.x + frameObj[0] + frameObj[2] &&
            this.y + frameThis[1] + frameThis[3] >= obj.y + frameObj[1] &&
            this.y + frameThis[1] <= obj.y + frameObj[1] + frameObj[3];
    }


    /**
     * Abfrage, ob eine vertikale Überlappung mit einem anderen Objekt vorliegt
     * @param {Object} obj - Objekt der Kollision
     * @returns {Boolean} true = Kollision, false = keine Kollision
     */
    checkVerticalOverlap(obj) {
        return this.y + this.frames[0][1] + this.frames[0][3] >= obj.y + obj.frames[0][1] &&
            this.y + this.frames[0][1] <= obj.y + obj.frames[0][1] + obj.frames[0][3];
    }


    /**
     * Abfrage, ob ein Mindestabstand zu einem Objekt nach links unterschritten wird
     * @param {Object} obj - Objekt der Kollision
     * @param {Number} threshold - Mindestabstand
     * @returns true = Überschreitung, false = keine Überschreitung
     */
    checkDistanceLeft(obj, threshold) {
        const thisX = this.x + this.frames[0][0];
        const objX = obj.x + obj.frames[0][0] + obj.frames[0][2];
        return thisX > objX && thisX - objX < threshold;
    }


    /**
     * Abfrage, ob ein Mindestabstand zu einem Objekt nach rechts unterschritten wird
     * @param {Object} obj - Objekt der Kollision
     * @param {Number} threshold - Mindestabstand
     * @returns true = Überschreitung, false = keine Überschreitung
     */
    checkDistanceRight(obj, threshold) {
        const thisX = this.x + this.frames[0][0] + this.frames[0][2];
        const objX = obj.x + obj.frames[0][0];
        return thisX < objX && objX - thisX < threshold;
    }


    /**
     * Treffer durch Objekt
     * @param {Object} obj - Objekt der Kollision
     */
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


    /**
     * Abfrage, ob dieses Objekt aktuell getroffen werden kann (für Bosskampf)
     * @returns {Boolean} true = Treffer möglich, false = kein Treffer möglich
     */
    canGetHit() {
        return !(this instanceof Boss) || this.isRecovered();
    }


    /**
     * dieses Objekt ist ein Boss-Objekt und wird getroffen
     */
    bossHit() {
        this.state = 'hit';
        this.hurt();
    }


    /**
     * Abfrage, ob dieses Objekt sich vom letzten Treffer erholt hat
     * @returns {Boolean} true = erholt, false = noch nicht erholt
     */
    isRecovered() {
        return (!(this instanceof Boss) && this.state != 'hit' && this.state != 'dead') ||
            Date.now() - this.lastHit > this.recoveryDuration;
    }


    /**
     * Abfrage, ob dieses Objekt tot ist
     * @returns {Boolean} true = tot, false = lebendig
     */
    isDead() {
        return this.health == 0;
    }


    /**
     * sterben
     */
    die() {
        this.state = 'dead';
    }
}