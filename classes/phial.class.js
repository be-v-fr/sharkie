class Phial extends Item {
    /**
     * Konstruktor
     * @param {Number} xStart - x-Startposition
     * @param {Number} y - y-Position
     */
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/poison/1.png');
        this.width = 78;
        this.height = 88;
        this.initFrame(15, 38, 34, 37);
        if (Math.random() > 0.5) {
            this.otherDirection = true;
        }
        this.animate('bubbling');
    }

    
    /**
     * Phial wird gesammelt
     */
    collect() {
        super.collect();
        if (world.character.poison <= 80) {
            world.character.poison += 20;
            world.stats[2].update(world.character.poison);
        }
    }
}