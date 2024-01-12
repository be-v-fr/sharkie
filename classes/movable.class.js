class Movable {
    img;
    x = 0;
    y = 0;
    width = 0;
    height = 0;

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