class Character extends Movable {
    width = 150;
    height = 225;

    constructor(x, y) {
        super(x, y);
        super.loadImage('../img/sharkie/1.IDLE/1.png');
    }

    jump() {

    }
}