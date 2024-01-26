class Level {
    backdrop = [];
    backdropUnits;
    length;
    enemies;
    items;
    floor;

    constructor(backdropUnits, enemies, obstacles, items) {
        this.backdropUnits = backdropUnits;
        this.obstacles = obstacles;
        this.items = items;
        this.enemies = enemies;
        this.createBackdrop(backdropUnits);
        this.length = 1439 * backdropUnits;
        this.floor = this.backdrop[this.backdrop.length - backdropUnits - 1];
    }

    createBackdrop(repeat) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < repeat; j++) {
                let x = 1439 * j;
                this.backdrop.push(new Backdrop(i, x));
            }
        }
        this.backdrop.push(new Backdrop(4, 720 * (repeat - 1)));
    }

    getNumberOfCoins() {
        const coins = this.items.filter((i) => i instanceof Coin);
        return coins.length; 
    }
}