class Character extends Movable {
    width = 150;
    height = 225;

    constructor() {
        super().loadImage('../img/sharkie/1.IDLE/1.png');
        this.x = 80;
        this.y = 100;
    }

    jump() {

    }
}