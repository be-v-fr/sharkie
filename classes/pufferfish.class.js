class Pufferfish extends Movable { // weitere Klasse "Enemy" erstellen, um auch andere Gegner einzubinden, ohne aber Code doppelt schreiben zu müssen??
    width = 56;
    height = 56;
    speed = -0.6 * (1 + Math.random());

    constructor() {
        super().loadingNow('pufferfish');
        this.loadImage('../img/enemy/1.Pufferfish/1.Swim/1.png');
        this.x = 150 + Math.random() * 500;
        this.y = 300 + Math.random() * 100;
        this.damage = 4;
        this.initFrame(3, 6, 65, 48);
        this.sounds = {
            'die': new Audio('../audio/pufferfish_die.mp3')
        };
        this.loadImages('normal', '../img/enemy/1.Pufferfish/1.Swim/', 5);
        this.loadImages('transition', '../img/enemy/1.Pufferfish/2.Transition/', 5);
        this.loadImages('blown', '../img/enemy/1.Pufferfish/3.Bubbleswim/', 5);
        this.loadImages('die', '../img/enemy/1.Pufferfish/4.Die/', 3);
        this.animate('normal');
        this.moveX(this.speed);
    }

    attack() {
        this.state = 'attacking';
        clearInterval(this.animateIntervalId);
        this.playAnimationOnce('transition');
        setTimeout(() => {
            clearInterval(this.moveIntervalId);
            this.moveX(2.4 * this.speed * (1 + Math.random()));
            this.animate('blown');
            this.frames[0][1] -= 4;
            this.frames[0][3] = 72;            
        }, 420);
    }

    die() {
        this.state = 'dead';
        this.clearIntervals();
        this.playSound('die');
        this.playAnimationOnce('die');
        this.driftUp();
    }

    driftUp() {
        let speedY = 1.5;
        setInterval(() => {
            this.x -= 0.18;
            if(speedY < 2.5) {
                speedY += 0.2;
            }
            this.y -= speedY;
        }, 1000 / 60);
    }
}