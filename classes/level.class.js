class Level {
    backdrop = [];
    backdropUnits;
    length;
    enemies;
    items;
    floor;

    /**
     * constructor
     * @param {Number} backdropUnits - number of consecutive backdrop images placed next to each other
     * @param {Array} enemies - contains enemy objects
     * @param {Array} obstacles - contains obstacle objects
     * @param {Array} items - contains item objects
     */
    constructor(backdropUnits, enemies, obstacles, items) {
        this.backdropUnits = backdropUnits;
        this.obstacles = obstacles;
        this.items = items;
        this.enemies = enemies;
        this.createBackdrop(backdropUnits);
        this.length = 1439 * backdropUnits;
        this.floor = this.backdrop[this.backdrop.length - backdropUnits - 1];
    }


    /**
     * create all stacked backdrop layers
     * @param {Number} repeat - number of horizontal repetitions (fit to level length) 
     */
    createBackdrop(repeat) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j <= repeat; j++) {
                let x = 1439 * (j - 1);
                this.backdrop.push(new Backdrop(i, x));
            }
        }
        this.backdrop.push(new Backdrop(4, 720 * (repeat - 1)));
    }


    /**
     * request total number of coins contained in this level
     * @returns {Number} number of coins
     */
    getNumberOfCoins() {
        const coins = this.items.filter((i) => i instanceof Coin);
        return coins.length; 
    }
}