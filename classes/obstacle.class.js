class Obstacle extends Movable {
    // Bewegung mit Boden, wie bei "world.setBackdrop()"

    constructor(type, xStart) { // x-Koord. reicht!!
        super().loadImage(`./img/background/Barrier/${type}.png`);
        this.damage = 2;
        if (type == 1) {
            this.width = 720;
            this.height = 480;
        } else if (type == 2) {
            this.width = 420;
            this.height = 140;
            this.initFrame(16, 52, 390, 100);

        } else if (type == 3) {
            this.width = 120;
            this.height = 320;
            this.initFrame(16, 12, 90, 300);
        }
        this.xStart = xStart;
        this.y = 480 - this.height;
    }
}