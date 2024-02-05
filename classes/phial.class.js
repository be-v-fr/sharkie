class Phial extends Item {
    // Animation hinzufügen
    // schräg positionieren
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/2.Poison/1.png');
        this.width = 56;
        this.height = 72;
        this.initFrame(10, 33, 34, 37);
        this.sounds = {
            'collect': new Audio('../audio/collect.mp3')
        };
    }
}