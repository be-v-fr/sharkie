class Stats extends Visible {
    /**
     * Konstruktor
     * @param {Number} x - x-Position
     * @param {Number} y - y-Position
     * @param {String} type - Typ der Statistik
     */
    constructor(x, y, type) {
        super().loadImage(`./img/marks/green/${type}/6.png`);
        this.loadImages('bar', `./img/marks/green/${type}/`, 6);
        this.x = x;
        this.y = y;
        this.width = 188;
        this.height = 48;
        this.initFrame(0, 0, this.width, this.height);
    }


    /**
     * Statistik aktualisieren
     * @param {Number} value - Prozentwert der Statistik
     */
    update(value) {
        let index = this.resolveImageIndex(value);
        this.img = this.imageCache['bar'][index];
    }


    /**
     * zu Prozentwert gehörenden Bildindex abfragen
     * @param {Number} value - Prozentwert der Statistik
     * @returns {Number} Bildindex
     */
    resolveImageIndex(value) {
        let index = 5;
        if (value < 100) {
            if (value <= 0) {
                index = 0;
            } else {
                index = (value - 1) / 20;
                index = Math.floor(index) + 1;
            }
        }
        return index;
    }
}