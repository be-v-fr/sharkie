class Bubble extends Movable {
    width = 24;
    height = 24;
    damage = 4;
    speed = 6;
    isEmpty = true;
    sound;

    constructor(x, y, isToxic, goLeft) {
        if (isToxic) {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Poisoned Bubble.png');
        } else {
            super().loadImage('../img/sharkie/4.Attack/Bubble trap/Bubble.png');
        }
        this.loadImages('green jellyfish', '../img/enemy/2.Jellyfish/Dead/green/', 4);
        this.loadImages('lila jellyfish', '../img/enemy/2.Jellyfish/Dead/lila/', 4);
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
        this.sounds = {
            'blow': new Audio('../audio/bubble.mp3'),
            'pop': new Audio('../audio/bubble_pop.mp3'),
        };
        if(isLoaded()) {
            this.playSound('blow');
        }
    }

    driftXY(speed) {
        let counter = 0;
        let factor;
        setInterval(() => {
            if(counter < 6) {
                factor = 1 + 0.03 * (6 - counter);
                this.width *= factor;
                this.height *= factor;
                this.frames[0][2] = this.width;
                this.frames[0][3] = this.height;
            }
            this.x += speed * (1 - (counter/250));
            this.y += 1.8 * (1 - (counter/40));
            counter++;
        }, 1000 / 60);
    }

    catchJellyfish(color) {
        this.playSound('blow');
        this.animate(`${color} jellyfish`);
        this.isEmpty = false;
    }
}