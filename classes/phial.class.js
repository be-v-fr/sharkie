class Phial extends Item {
    /**
     * constructor
     * @param {Number} xStart - x starting position
     * @param {Number} y - y position
     */
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/poison/1.png');
        this.width = 78;
        this.height = 88;
        this.initFrame(15, 38, 34, 37);
        if (Math.random() > 0.5) {
            this.otherDirection = true;
        }
        this.animate('bubbling', 1000 / 4);
    }

    
    /**
     * this phial is being collected
     */
    collect() {
        super.collect();
        if (world.character.poison <= 80) {
            world.character.poison += 20;
            world.stats[2].update(world.character.poison);
        }
    }
}