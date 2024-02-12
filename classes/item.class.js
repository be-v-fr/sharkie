class Item extends Movable {
    /**
     * Konstruktor
     * @param {Number} xStart - x-Startposition
     * @param {Number} y - y-Position
     */
    constructor(xStart, y) {
        super();
        this.xStart = xStart;
        this.y = y;
        this.damage = 0;
    }

    /**
     * Item wird gesammelt
     */
    collect() {
        this.playSound('collect');
    }
}