class Obstacle extends Movable {
    /**
     * constructor
     * @param {Number} type - obstacle type
     * @param {Number} xStart - x starting position 
     */
    constructor(type, xStart) {
        super().loadImage(`./img/background/barrier/${type}.png`);
        this.setDamage(2, 5);
        this.setTypeProperties(type);
        this.xStart = xStart;
        this.y = 480 - this.height;
    }


    /**
     * set type-specific properties/coordinates
     * @param {Number} type - obstacle type
     */
    setTypeProperties(type) {
        if (type == 1) {
            this.setType1Properties();
        } else if (type == 2) {
            this.setType2Properties();
        } else if (type == 3) {
            this.setType3Properties();
        }
    }


    /**
     * set type 1 properties/coordinates
     */
    setType1Properties() {
        this.width = 720;
        this.height = 480;
        this.initFrame(10, 0, 696, 126);
        this.initFrame(460, 120, 120, 60);
        this.initFrame(12, 390, 696, 100);
        this.initFrame(190, 364, 450, 40);
    }


    /**
     * set type 2 properties/coordinates
     */
    setType2Properties() {
        this.width = 420;
        this.height = 140;
        this.initFrame(16, 56, 390, 100);
        this.initFrame(92, 26, 256, 32);
        this.initFrame(178, 4, 164, 24);        
    }


    /**
     * set type 3 properties/coordinates
     */
    setType3Properties() {
        this.width = 120;
        this.height = 320;
        this.initFrame(16, 12, 90, 300);        
    }
}