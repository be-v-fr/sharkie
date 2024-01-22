class Bubble extends Movable {
    width = 32;
    height = 32;
    damage = 4;
    isToxic = false;
    goLeft = false;
    // Geschwindigkeit festlegen: x konstant, y erst negativ, dann nach oben beschleunigt

    constructor(x, y, isToxic, goLeft) {
        if (isToxic) {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Poisoned Bubble.png'); // Größe an normale Bubble anpassen
        } else {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Bubble.png');
        }
        this.isToxic = isToxic;
        this.goLeft = goLeft;
        this.x = x;
        this.y = y;
        this.initFrame(0, 0, this.width, this.height);
    }

    getDamage() {
        if (this.isToxic) {
            return 2 * this.damage;
        } else {
            return this.damage;
        }
    }

    pop() {

    }
}