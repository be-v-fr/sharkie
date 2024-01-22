class Bubble extends Movable {
    width = 32;
    height = 32;
    damage = 4;
    speed = 3 + 3;
    // Geschwindigkeit festlegen: x konstant, y erst negativ, dann nach oben beschleunigt

    constructor(x, y, isToxic, goLeft) {
        if (isToxic) {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Poisoned Bubble.png'); // Größe an normale Bubble anpassen
        } else {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Bubble.png');
        }
        this.x = x;
        this.y = y;
        this.initFrame(0, 0, this.width, this.height);
        if(goLeft) {
            this.speed = - this.speed
        }
        if(isToxic) {
            this.damage *= 2;
            this.speed *= 1.8;
        }
        this.driftXY(this.speed);
    }

    getDamage() {
        if (this.isToxic) {
            return 2 * this.damage;
        } else {
            return this.damage;
        }
    }

    driftXY(speed) {
        let counter = 0;
        setInterval(() => {

            this.x += speed * (1 - (counter/250));
            this.y += 1.8 * (1 - (counter/40));
            counter++;
        }, 1000 / 60);
    }

    pop() {

    }
}