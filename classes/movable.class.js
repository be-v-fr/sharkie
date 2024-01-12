class Movable {
    img;
    x = 100;
    y = 100;

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