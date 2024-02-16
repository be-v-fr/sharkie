class Pufferfish extends Movable {
    width = 56;
    height = 56;
    speed = -0.6 * (1 + Math.random());

    /**
     * constructor
     * @param {Number} x - x position
     * @param {Number} y - y position 
     */
    constructor(x, y) {
        super().loadImage('./img/enemy/pufferfish/swim/1.png');
        this.x = x + Math.random() * 500;
        this.y = y + Math.random() * 100;
        this.setDamage(5, 10);
        this.health = 1;
        this.initFrame(3, 6, 48, 32);
        this.animate('normal', 1000 / 8);
        this.moveX(this.speed);
    }


    /**
     * execute attack towards character
     */
    attack() {
        this.state = 'attacking';
        clearInterval(this.animateIntervalId);
        this.playAnimationOnce('transition', 1000 / 12);
        setTimeout(() => {
            if (!this.isDead()) {
                clearInterval(this.moveIntervalId);
                this.moveX(2.4 * this.speed * (1 + Math.random()));
                this.animate('blown', 1000 / 8);
                this.frames[0][1] -= 4;
                this.frames[0][3] = 52;
            }
        }, 420);
    }


    /**
     * this function handles the pufferfish's death
     */
    die() {
        super.die();
        this.clearIntervals();
        this.playSound('die');
        this.playAnimationOnce('die', 1000 / 12);
        this.driftUp();
    }


    /**
     * drift up after dying
     */
    driftUp() {
        let speedY = 1.5;
        setInterval(() => {
            this.x -= 0.18;
            if (speedY < 2.5) {
                speedY += 0.2;
            }
            this.y -= speedY;
        }, 1000 / 60);
    }
}