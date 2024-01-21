class Stats extends Visible {
    imageCache = [
        './img/marks/green/Life/1.png',
        './img/marks/green/Life/2.png',
        './img/marks/green/Life/3.png',
        './img/marks/green/Life/4.png',
        './img/marks/green/Life/5.png',
        './img/marks/green/Life/6.png',
    ];
    // anders als bei movable kein JSON. Mögliche Umsetzung: Wird in loadImages() kein Name übergeben, einfach keinen Key aufrufen
    // und stattdessen in normalen Array ("[]" statt "{}") einfügen
    // alternativ: JSON.parse()??
    // AUßERDEM: Durch image-Objekte ersetzen!!

    constructor(x, y) {
        super().loadImage('./img/marks/green/Life/6.png');
        this.x = x;
        this.y = y;
        this.width = 188;
        this.height = 48;
        this.initFrame(0, 0, this.width, this.height);
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    update(value) {
        let index = this.resolveImageIndex(value);
        this.img.src = `./img/marks/green/Life/${index}.png`; // Pfadzuweisung durch image-Objekt ersetzen!!
    }

    resolveImageIndex(value) {
        let index = 6;
        if (value < 100) {
            if (value == 0) {
                index = 1;
            } else {
                index = value / 100 * (this.imageCache.length - 1);
                index = Math.floor(index) + 2;
            }
        }
        return index;
    }
}