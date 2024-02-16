class Bubble extends Movable {
    width = 24;
    height = 24;
    damage = 4;
    speed = 6;
    isEmpty = true;
    sound;

    /**
     * constructor
     * @param {Number} x - x position
     * @param {Number} y - y position
     * @param {Boolean} isToxic - bubble type (true = toxic, false = normal) 
     * @param {Boolean} goLeft - bubble movement direction 
     */
    constructor(x, y, isToxic, goLeft) {
        if (isToxic) {
            super().loadImage('./img/sharkie/attack/bubble_trap/poisoned.png');
            this.damage *= 2;
            this.speed *= 1.8;
        } else {
            super().loadImage('./img/sharkie/attack/bubble_trap/normal.png');
        }
        this.x = x;
        this.y = y;
        this.initFrame(0, 0, this.width, this.height);
        this.go(goLeft);
    }


    /**
     * bubble starts from character after initialization
     * @param {Boolean} goLeft - x direction (true = left, false = right) 
     */
    go(goLeft) {
        if (isLoaded()) {
            this.playSound('blow');
        }
        if(goLeft) {
            this.speed = -this.speed;
        }
        this.driftXY();
    }


    /**
     * x and y movement of bubble
     */
    driftXY() {
        let counter = 0;
        setInterval(() => {
            if (counter < 6) {
                this.growToFullSize(counter);
            }
            this.x += this.speed * (1 - (counter / 250));
            this.y += 1.8 * (1 - (counter / 40));
            counter++;
        }, 1000 / 60);
    }


    /**
     * blowing up of bubble
     * @param {Number} counter - current iteration step 
     */
    growToFullSize(counter) {
        const factor = 1 + 0.03 * (6 - counter);
        this.width *= factor;
        this.height *= factor;
        this.frames[0][2] = this.width;
        this.frames[0][3] = this.height;
    }


    /**
     * bubble catches jellyfish
     * @param {Boolean} color - color of jellyfish (green / lila) 
     */
    catchJellyfish(color) {
        this.playSound('blow');
        this.animate(`${color} jellyfish`, 1000 / 8);
        this.isEmpty = false;
    }
}