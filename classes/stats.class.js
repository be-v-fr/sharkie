class Stats extends Visible {
    constructor(x, y, type) {
        super().loadingNow('stats');
        this.loadImage(`./img/marks/green/${type}/6.png`);
        this.loadImages('bar', `./img/marks/green/${type}/`, 6);
        this.x = x;
        this.y = y;
        this.width = 188;
        this.height = 48;
        this.initFrame(0, 0, this.width, this.height);
    }

    update(value) {
        let index = this.resolveImageIndex(value);
        this.img = this.imageCache['bar'][index];
    }

    resolveImageIndex(value) {
        let index = 5;
        if (value < 100) {
            if (value <= 0) {
                index = 0;
            } else {
                // index = (value - 1) / 100 * (this.imageCache['bar'].length - 1);
                index = (value - 1) / 20;
                index = Math.floor(index) + 1;
            }
        }
        return index;
    }
}