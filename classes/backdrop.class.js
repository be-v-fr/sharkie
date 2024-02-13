class Backdrop extends Movable {
    width = 1440;
    height = 480;
    speed = 0.18
    layerData = [
        {
            'dir': '5.Water',
            'speedFactor': 0.25
        },

        {
            'dir': '4.Fondo',
            'speedFactor': 0.4
        },

        {
            'dir': '3.Fondo',
            'speedFactor': 0.45
        },

        {
            'dir': '2.Floor',
            'speedFactor': 1
        },

        {
            'dir': '1.Light',
            'speedFactor': 1
        }
    ]

    /**
     * Konstruktor
     * @param {Number} layer - Ebene des Hintergrunds 
     * @param {Number} x - x-Position des Bildes
     */
    constructor(layer, x) {
        super().loadImage(`./img/background/Layers/${this.layerData[layer]['dir']}/D.png`);
        this.x = x;
        this.xStart = this.x;
        this.speedFactor = this.layerData[layer]['speedFactor'];
    }

    
    /**
     * x-Bewegungsrichtung ändern
     */
    turnAround() {
        clearInterval(this.moveIntervalId);
        this.speed = -this.speed;
        this.moveX(-this.speed);
    }
}