class Backdrop extends Movable {
    width = 1440;
    height = 480;
    speed = 0.18

    /**
     * Konstruktor
     * @param {number} layer - Ebene des Hintergrunds 
     * @param {number} x - x-Position des Bildes
     */
    constructor(layer, x) {
        let path = './img/background/Layers/';
        let speedFactor = 1;
        if (layer == 0) {
            path = path + '5.Water';
            speedFactor = 0.25;
        } else {
            if (layer == 1) {
                path = path + '4.Fondo';
                speedFactor = 0.4;
            } else {
                if (layer == 2) {
                    path = path + '3.Fondo';
                    speedFactor = 0.45;
                } else {
                    if (layer == 3) {
                        path = path + '2.Floor';
                    } else {
                        if (layer == 4) {
                            path = path + '1.Light';
                        }
                    }
                }
            }
        }
        path = path + '/D.png';
        super().loadImage(path);
        this.x = x;
        this.xStart = this.x;
        this.speedFactor = speedFactor;
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