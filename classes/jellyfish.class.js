class Jellyfish extends Movable { // weitere Klasse "Enemy" erstellen, um auch andere Gegner einzubinden, ohne aber Code doppelt schreiben zu müssen??
    width = 64;
    height = 64;
    color;

    constructor(color, x, y) {
        super().loadImage(`../img/enemy/2.Jellyfish/${color}/1.png`);
        this.loadImages('normal', `../img/enemy/2.Jellyfish/${color}/`, 4);
        this.color = color;
        if (color == 'green') {
            if (settings['hardMode']) {
                this.damage = 20;
            } else {
                this.damage = 12;
            }
        } else {
            if (settings['hardMode']) {
                this.damage = 8;
            } else {
                this.damage = 4;
            }
        }
        this.x = x;
        this.y = y;
        this.health = 1;
        this.initFrame(8, 6, 48, 48);
        this.animate('normal');
        this.moveX(-0.18);
    }
}