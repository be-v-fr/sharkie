class Character extends Movable {
    width = 150;
    height = 225;
    world;
    poison = 40;

    constructor() {
        super().loadImage('../img/sharkie/1.IDLE/1.png');
        this.x = 80;
        this.y = 100;
        this.initFrame(30, 108, 90, 60);
        this.swimAndSinkY();
    }

    attack() {
        // Animation etc.
        const isToxic = this.poison > 0;
        world.bubbles.push(new Bubble(this.x + 100, this.y + 130, isToxic));
        if(isToxic) {
            this.poison -= 20;
        }
    }
}