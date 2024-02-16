class Jellyfish extends Movable {
    width = 64;
    height = 64;
    color;

    /**
     * Konstruktor
     * @param {String} color - Farbe (grün/lila)
     * @param {Number} x - x-Position
     * @param {Number} y - y-Position
     */
    constructor(color, x, y) {
        super().loadImage(`./img/enemy/jellyfish/${color}/1.png`);
        this.color = color;
        this.setDamage(color);
        this.x = x;
        this.y = y;
        this.health = 1;
        this.initFrame(8, 6, 48, 48);
        this.animate(`normal ${color}`, 1000 / 8);
        this.moveX(-0.18);
    }


    /**
     * Schaden festlegen (für Kollision mit Character)
     * @param {String} color - Farbe (grün/lila)
     */
    setDamage(color) {
        if (color == 'green') {
            super.setDamage(12, 20);
        } else {
            super.setDamage(4, 8);
        }
    }
}