class Backdrop extends Movable {
    width = 1440;
    height = 480;
    speed = 0.18
    layerData = [
        {
            'name': 'water',
            'speedFactor': 0.25
        },

        {
            'name': 'intermediate_1',
            'speedFactor': 0.4
        },

        {
            'name': 'intermediate_2',
            'speedFactor': 0.45
        },

        {
            'name': 'floor',
            'speedFactor': 1
        },

        {
            'name': 'light',
            'speedFactor': 1
        }
    ]

    /**
     * Konstruktor
     * @param {Number} layer - Ebene des Hintergrunds 
     * @param {Number} x - x-Position des Bildes
     */
    constructor(layer, x) {
        super().loadImage(`./img/background/layers/${this.layerData[layer]['name']}.png`);
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