class Stats extends Visible {
    type;

    constructor(x, y, type) { // type = 'coins', 'health' oder 'poison'
        super().loadImage(`./img/marks/green/${type}/6.png`);
        this.loadImages(type, `./img/marks/green/${type}/`, 6);
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 188;
        this.height = 48;
        this.initFrame(0, 0, this.width, this.height);
    }

    update(value) {
        let index = this.resolveImageIndex(value);
        this.img = this.imageCache[`${this.type}`][index];
    }

    resolveImageIndex(value) {
        let index = 5;
        if (value < 100) {
            if (value <= 0) {
                index = 0;
            } else {
                // index = value / 100 * (this.imageCache[this.type].length - 1);
                index = value / 20;
                index = Math.floor(index) + 1;
            }
        }
        return index;
    }
}