class Item extends Movable {
    /**
     * constructor
     * @param {Number} xStart - x starting position
     * @param {Number} y - y position
     */
    constructor(xStart, y) {
        super();
        this.xStart = xStart;
        this.y = y;
        this.damage = 0;
    }

    /**
     * this item is being collected
     */
    collect() {
        this.playSound('collect');
    }
}