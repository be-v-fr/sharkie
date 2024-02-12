class Level {
    backdrop = [];
    backdropUnits;
    length;
    enemies;
    items;
    floor;

    /**
     * Konstruktor
     * @param {Number} backdropUnits - Anzahl aufeinanderfolgender Hintergrundgrafiken
     * @param {Array} enemies - Gegner-Objekte
     * @param {Array} obstacles - Hindernis-Objekte
     * @param {Array} items - Item-Objekte
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
     * alle Hintergrundlayer erzeugen
     * @param {Number} repeat - Anzahl der Wiederholungen 
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
     * Gesamtzahl der Coins im Level abfragen
     * @returns {Number} Anzahl der Coins
     */
    getNumberOfCoins() {
        const coins = this.items.filter((i) => i instanceof Coin);
        return coins.length; 
    }
}