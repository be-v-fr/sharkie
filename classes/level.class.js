class Level {
    backdrop = [];
    backdropUnits;
    length;
    enemies;
    floor;

    constructor(backdropUnits, enemies, obstacles) {
        this.backdropUnits = backdropUnits;
        this.obstacles = obstacles
        this.enemies = enemies;
        this.createBackdrop(backdropUnits);
        this.length = 1439 * backdropUnits;
        this.floor = this.backdrop[this.backdrop.length - backdropUnits - 1];
    }

    createBackdrop(repeat) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < repeat; j++) {
                let x = 1439 * j;
                this.backdrop.push(new Backdrop(i, x));
            }
        }
        this.backdrop.push(new Backdrop(4, 720 * (repeat - 1)));
    }
}