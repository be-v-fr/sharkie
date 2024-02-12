class Item extends Movable {
    constructor(xStart, y) {
        super();
        this.xStart = xStart;
        this.y = y;
        this.damage = 0;
    }

    collect() {
        this.playSound('collect');
    }
}