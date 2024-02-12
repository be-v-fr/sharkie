class Coin extends Item {
    /**
     * Konstruktor
     * @param {Number} xStart - x-Startposition
     * @param {Number} y - y-Position
     */
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/1.Coins/1.png');
        this.width = 32;
        this.height = 32;
        this.initFrame(0, 0, this.width, this.height);
    }

    /**
     * Coin wird gesammelt
     */
    collect() {
        super.collect();
        world.character.coins++;
        const progress = 100 * world.character.coins / world.numberOfCoins;
        world.stats[1].update(progress);
    }
}