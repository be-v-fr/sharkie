class Bubble extends Movable {
    width = 24;
    height = 24;
    damage = 4;
    speed = 6;
    isEmpty = true;
    sound;

    /**
     * Konstruktor
     * @param {Number} x - x-Koordinate
     * @param {Number} y - y-Koordinate
     * @param {Boolean} isToxic - giftige (true) oder normale (false) Bubble
     * @param {Boolean} goLeft - Bewegungsrichtung der Bubble 
     */
    constructor(x, y, isToxic, goLeft) {
        if (isToxic) {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Poisoned Bubble.png');
        } else {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Bubble.png');
        }
        this.x = x;
        this.y = y;
        this.initFrame(0, 0, this.width, this.height);
        if (goLeft) {
            this.speed = - this.speed
        }
        if (isToxic) {
            this.damage *= 2;
            this.speed *= 1.8;
        }
        this.driftXY(this.speed);
        if (isLoaded()) {
            this.playSound('blow');
        }
    }


    /**
     * x- und y-Bewegung der Bubble
     * @param {Number} speed - Tempo 
     */
    driftXY(speed) {
        let counter = 0;
        setInterval(() => {
            if (counter < 6) {
                this.growToFullSize(counter);
            }
            this.x += speed * (1 - (counter / 250));
            this.y += 1.8 * (1 - (counter / 40));
            counter++;
        }, 1000 / 60);
    }


    /**
     * Aufblasen der Bubble
     * @param {Number} counter - aktueller Iterationsschritt 
     */
    growToFullSize(counter) {
        const factor = 1 + 0.03 * (6 - counter);
        this.width *= factor;
        this.height *= factor;
        this.frames[0][2] = this.width;
        this.frames[0][3] = this.height;
    }


    /**
     * Jellyfish einfangen
     * @param {Boolean} color - Farbe des Jellyfish (grün/lila) 
     */
    catchJellyfish(color) {
        this.playSound('blow');
        this.animate(`${color} jellyfish`);
        this.isEmpty = false;
    }
}