class Phial extends Movable {
    constructor(xStart, y) {
        super().loadImage('./img/marks/2.Poison/1.png');
        this.damage = 0;
        this.width = 32;
        this.height = 32;
        this.initFrame(0, 0, this.width, this.height);
        this.xStart = xStart;
        this.y = y;
    }
}