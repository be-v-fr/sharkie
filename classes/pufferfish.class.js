class Pufferfish extends Movable {
    width = 75;
    height = 75;

    constructor() {
        super().loadImage('../img/enemy/1.Puffer fish/1.Swim/1.swim1.png');
        this.x = 150 + Math.random() * 500;
        this.y = 300 + Math.random() * 100;
    }
}