class Backdrop extends Movable {
    width = 1440;
    height = 480;

    constructor(path) {
        super().loadImage(path);
    }
}