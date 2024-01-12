class Movable {
    img;
    x = 100;
    y = 100;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('moving right');
    }

    moveLeft() {
        console.log('moving left');
    }
}