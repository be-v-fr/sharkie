class Obstacle extends Movable {
    constructor(type, xStart) {
        super().loadImage(`./img/background/Barrier/${type}.png`);
        if (settings['hardMode']) {
            this.damage = 5;
        } else {
            this.damage = 2;
        }
        if (type == 1) {
            this.width = 720;
            this.height = 480;
            this.initFrame(10, 0, 696, 126);
            this.initFrame(460, 120, 120, 60);
            this.initFrame(32, 370, 696, 120);
        } else if (type == 2) {
            this.width = 420;
            this.height = 140;
            this.initFrame(16, 56, 390, 100);
            this.initFrame(92, 26, 256, 32);
            this.initFrame(178, 4, 164, 24);
        } else if (type == 3) {
            this.width = 120;
            this.height = 320;
            this.initFrame(16, 12, 90, 300);
        }
        this.xStart = xStart;
        this.y = 480 - this.height;
    }
}