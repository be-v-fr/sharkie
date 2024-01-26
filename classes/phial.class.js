class Phial extends Item {
    // Animation hinzufügen
    // schräg positionieren
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/2.Poison/1.png');
        this.width = 56;
        this.height = 72;
        this.initFrame(0, 0, this.width, this.height);
    }
}