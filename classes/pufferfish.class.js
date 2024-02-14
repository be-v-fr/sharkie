class Pufferfish extends Movable { // weitere Klasse "Enemy" erstellen, um auch andere Gegner einzubinden, ohne aber Code doppelt schreiben zu müssen??
    width = 56;
    height = 56;
    speed = -0.6 * (1 + Math.random());

    /**
     * Konstruktor
     * @param {Number} x - x-Position
     * @param {Number} y - y-Position 
     */
    constructor(x, y) {
        super().loadImage('./img/enemy/pufferfish/swim/1.png');
        this.x = x + Math.random() * 500;
        this.y = y + Math.random() * 100;
        this.setDamage(5, 10);
        this.health = 1;
        this.initFrame(3, 6, 48, 32);
        this.animate('normal');
        this.moveX(this.speed);
    }


    /**
     * Attacke ausführen
     */
    attack() {
        this.state = 'attacking';
        clearInterval(this.animateIntervalId);
        this.playAnimationOnce('transition');
        setTimeout(() => {
            clearInterval(this.moveIntervalId);
            this.moveX(2.4 * this.speed * (1 + Math.random()));
            this.animate('blown');
            this.frames[0][1] -= 4;
            this.frames[0][3] = 52;            
        }, 420);
    }


    /**
     * sterben
     */
    die() {
        super.die();
        this.clearIntervals();
        this.playSound('die');
        this.playAnimationOnce('die');
        this.driftUp();
    }


    /**
     * nach oben treiben
     */
    driftUp() {
        let speedY = 1.5;
        setInterval(() => {
            this.x -= 0.18;
            if(speedY < 2.5) {
                speedY += 0.2;
            }
            this.y -= speedY;
        }, 1000 / 60);
    }
}