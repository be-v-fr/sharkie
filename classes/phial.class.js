class Phial extends Item {
    // Animation hinzufügen
    // schräg positionieren
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/2.Poison/1.png');
        this.width = 78;
        this.height = 88;
        this.initFrame(15, 38, 34, 37);
        if (Math.random() > 0.5) {
            this.otherDirection = true;
        }
        this.loadImages('bubbling', './img/marks/2.Poison/animated/', 8);
        this.sounds = {
            'collect': new Audio('../audio/collect.mp3')
        };
        this.animate('bubbling');
        // einfachste Lösung: Neigung in Bildern festlegen, dort auch Erde hinzufügen
        // über otherDirection Bild flippen
    }
}