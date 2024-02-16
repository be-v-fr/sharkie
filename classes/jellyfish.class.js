class Jellyfish extends Movable {
    width = 64;
    height = 64;
    color;

    /**
     * constructor
     * @param {String} color - color (green/lila)
     * @param {Number} x - x position
     * @param {Number} y - y position
     */
    constructor(color, x, y) {
        super().loadImage(`./img/enemy/jellyfish/${color}/1.png`);
        this.color = color;
        this.setDamage();
        this.x = x;
        this.y = y;
        this.health = 1;
        this.initFrame(8, 6, 48, 48);
        this.animate(`normal ${color}`, 1000 / 8);
        this.moveX(-0.18);
    }


    /**
     * set damage for character collision
     */
    setDamage() {
        if (this.color == 'green') {
            super.setDamage(12, 20);
        } else {
            super.setDamage(4, 8);
        }
    }
}