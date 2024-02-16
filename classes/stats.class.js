class Stats extends Visible {
    /**
     * constructor
     * @param {Number} x - x position on game canvas
     * @param {Number} y - y position on game canvas
     * @param {String} type - stats type (health/poison/coins)
     */
    constructor(x, y, type) {
        super().loadImage(`./img/marks/stats/${type}/6.png`);
        this.loadImages('bar', `./img/marks/stats/${type}/`, 6);
        this.x = x;
        this.y = y;
        this.width = 188;
        this.height = 48;
        this.initFrame(0, 0, this.width, this.height);
    }


    /**
     * update stats object after change
     * @param {Number} value - percentage value of stats object
     */
    update(value) {
        let index = this.resolveImageIndex(value);
        this.img = this.imageCache['bar'][index];
    }


    /**
     * request the image index (within this object's image cache) corresponsing the given percentage value
     * @param {Number} value - percentage value
     * @returns {Number} image index
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