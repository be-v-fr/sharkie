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
        if (sounds[classToString]) {
            this.sounds = sounds[classToString];
        }
    }


    /**
     * Animation und Sound einmalig abspielen
     * @param {String} name - Name von Animation und Sound (muss identisch sein) 
     */
    playAnimationOnceWithSound(name) {
        this.playAnimationOnce(name);
        this.playSound(name);
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
        this.moveIntervalId = -1;
        clearInterval(this.animateIntervalId);
        this.animateIntervalId = -1;
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
        if (!this.isDead()) {
            this.health -= obj.damage;
            if (this.health <= 0) {
                this.health = 0;
                this.die(obj);
            } else {
                this.lastHit = Date.now();
            }
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
}