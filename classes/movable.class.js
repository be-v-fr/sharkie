class Movable {
    name;
    img;
    x;
    y;
    width;
    height;

    constructor(name, img, x, y, width, height) {
        this.name = name;
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    moveRight() {
        console.log('moving right');
    }

    moveLeft() {
        console.log('moving left');
    }
}