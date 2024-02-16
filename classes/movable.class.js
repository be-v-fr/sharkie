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
     * constructor
     */
    constructor() {
        super();
        this.loadSounds();
    }


    /**
     * load sounds (using data from 'js/path.js')
     */
    loadSounds() {
        const classToString = this.constructor.name;
        if (sounds[classToString]) {
            this.sounds = sounds[classToString];
        }
    }


    /**
     * play animation and sound
     * @param {String} name - animation and sound name (required to be identical for both)
     * @param {Number} ms - frame interval in milliseconds
     */
    playAnimationOnceWithSound(name, ms) {
        this.playAnimationOnce(name, ms);
        this.playSound(name);
    }


    /**
     * set collision damage taken by colliding object
     * @param {Number} normal - damage in normal difficulty mode
     * @param {Number} hard - damage in hard mode
     */
    setDamage(normal, hard) {
        if (settings['hardMode']) {
            this.damage = hard;
        } else {
            this.damage = normal;
        }
    }


    /**
     * clear movement and animation intervals
     */
    clearIntervals() {
        clearInterval(this.moveIntervalId);
        this.moveIntervalId = -1;
        clearInterval(this.animateIntervalId);
        this.animateIntervalId = -1;
    }


    /**
     * move horizontally
     * @param {Number} speed - absolute value of movement speed 
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
     * vertical swimming and sinking movement
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
     * request if this object is above ground
     * @returns {Boolean} true = above ground, false = below ground y value
     */
    isAboveGround() {
        return this.y <= this.yMax;
    }


    /**
     * request if this object is below maximum height
     * @returns {Boolean} true = below maximum height, false = above maximum y value
     */
    isBelowRoof() {
        return this.y >= this.yMin;
    }


    /**
     * prevent this object from crossing y boundaries
     * (by setting it to the border y value, respectively) 
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
     * sinking acceleration from any previous speed, restricted to maximum sinking speed (this.speedSinking)
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
     * request if this object collides with another object
     * @param {Object} obj - requested object
     * @returns {Boolean} true = collision, false = no collision
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
     * request if there is a collision between offset rectangles ('frames') of this object and another one, respectively
     * @param {Object} obj - requested object
     * @param {Array} frameThis - offset rectangle of this object
     * @param {Array} frameObj - offset rectangle of requested object
     * @returns {Boolean} true = collision, false = no collision
     */
    frameCollision(obj, frameThis, frameObj) {
        return this.x + frameThis[0] + frameThis[2] >= obj.x + frameObj[0] &&
            this.x + frameThis[0] <= obj.x + frameObj[0] + frameObj[2] &&
            this.y + frameThis[1] + frameThis[3] >= obj.y + frameObj[1] &&
            this.y + frameThis[1] <= obj.y + frameObj[1] + frameObj[3];
    }


    /**
     * request if there is a vertical overlap with another object
     * @param {Object} obj - requested object
     * @returns {Boolean} true = collision, false = no collision
     */
    checkVerticalOverlap(obj) {
        return this.y + this.frames[0][1] + this.frames[0][3] >= obj.y + obj.frames[0][1] &&
            this.y + this.frames[0][1] <= obj.y + obj.frames[0][1] + obj.frames[0][3];
    }


    /**
     * request if the distance this object has to another object on the left is below a minimum value 
     * @param {Object} obj - requested object
     * @param {Number} threshold - minimum value of distance
     * @returns true = threshold has been crossed, false = beyond threshold
     */
    checkDistanceLeft(obj, threshold) {
        const thisX = this.x + this.frames[0][0];
        const objX = obj.x + obj.frames[0][0] + obj.frames[0][2];
        return thisX > objX && thisX - objX < threshold;
    }


    /**
     * request if the distance this object has to another object on the right is below a minimum value 
     * @param {Object} obj - requested object
     * @param {Number} threshold - minimum value of distance
     * @returns true = threshold has been crossed, false = beyond threshold
     */
    checkDistanceRight(obj, threshold) {
        const thisX = this.x + this.frames[0][0] + this.frames[0][2];
        const objX = obj.x + obj.frames[0][0];
        return thisX < objX && objX - thisX < threshold;
    }


    /**
     * this function sets what happens when this object is hit by another object
     * @param {Object} obj - object causing the hit
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
     * request if this object can currently be hit
     * @returns {Boolean} true = can get hit, false = cannot get hit
     */
    canGetHit() {
        return !(this instanceof Boss) || this.isRecovered();
    }


    /**
     * request if this object has fully recovered from previous hit
     * @returns {Boolean} true = is recovered, false = is not recovered yet
     */
    isRecovered() {
        return (!(this instanceof Boss) && this.state != 'hit' && this.state != 'dead') ||
            Date.now() - this.lastHit > this.recoveryDuration;
    }


    /**
     * request if this object is dead
     * @returns {Boolean} true = dead, false = alive
     */
    isDead() {
        return this.health == 0;
    }


    /**
     * this function handles the object's death
     */
    die() {
        this.state = 'dead';
    }


    /**
     * bounce away from colliding object
     * @param {Object} obj - colliding object
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
     * bounce away along x axis
     * @param {Boolean} right - direction (true = right, false = left) 
     * @returns {Boolean} true, if there is a bounce motion along x axis
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
     * set the x position caused by x bouncing (also considering the level margins) 
     * @param {Boolean} right - direction (true = right, false = left) 
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
     * bounce away along y axis
     * @param {Boolean} right - direction (true = right, false = left) 
     * @returns {Boolean} true, if there is a bounce motion along y axis
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
     * request horizontal bouncing direction
     * @param {Object} obj - colliding object
     * @param {Array} frameThis - offset rectangle of this object
     * @param {Array} frameObj - offset rectangle of colliding object
     * @returns {Boolean} true = bounce to the left, false = bounce to the right, null = no x bounce
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
     * request vertical bouncing direction
     * @param {Object} obj - colliding object
     * @param {Array} frameThis - offset rectangle of this object
     * @param {Array} frameObj - offset rectangle of colliding object
     * @returns {Boolean} true = bounce down, false = bounce up, null = no y bounce
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
     * this function handles the case that bouncing places this object wrong
     * it sets this object to the left and to the vertical middle of the screen
     */
    bounceException() {
        this.x -= 100;
        this.y = 100;
    }
}