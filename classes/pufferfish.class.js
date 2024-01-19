class Pufferfish extends Movable { // weitere Klasse "Enemy" erstellen, um auch andere Gegner einzubinden, ohne aber Code doppelt schreiben zu müssen??
    width = 75;
    height = 75;

    constructor() {
        super().loadImage('../img/enemy/1.Puffer fish/1.Swim/1.swim1.png');
        this.x = 150 + Math.random() * 500;
        this.y = 300 + Math.random() * 100;
        this.initFrame(3, 6, 65, 48);
    }
}