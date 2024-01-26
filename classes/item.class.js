class Item extends Movable {
    sound;

    constructor(xStart, y) {
        super();
        this.xStart = xStart;
        this.y = y;
        this.damage = 0;
    }
}