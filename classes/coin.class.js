class Coin extends Item {
    /**
     * constructor
     * @param {Number} xStart - x starting position
     * @param {Number} y - y position
     */
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/coin/1.png');
        this.width = 32;
        this.height = 32;
        this.initFrame(0, 0, this.width, this.height);
        this.animate('normal', 1000 / 6);
    }

    /**
     * this coin is being collected
     */
    collect() {
        super.collect();
        world.character.coins++;
        const progress = 100 * world.character.coins / world.numberOfCoins;
        world.stats[1].update(progress);
    }
}