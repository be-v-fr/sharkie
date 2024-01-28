class Jellyfish extends Movable { // weitere Klasse "Enemy" erstellen, um auch andere Gegner einzubinden, ohne aber Code doppelt schreiben zu müssen??
    width = 64;
    height = 64;
    color;
    speed = -0.6 * (1 + Math.random());

    constructor(color) {
        super().loadingNow('jellyfish');
        this.loadImage(`../img/enemy/2.Jellyfish/${color}/1.png`);
        this.loadImages('normal', `../img/enemy/2.Jellyfish/${color}/`, 4);
        this.color = color;
        if(color == 'green') {
            this.damage == 12;
        } else {
            this.damage = 4;
        }



        this.x = 150 + Math.random() * 500;
        this.y = 300 + Math.random() * 100;

        this.initFrame(3, 6, 65, 48);

        this.animate('normal');
        this.moveX(-0.18);
    }
}