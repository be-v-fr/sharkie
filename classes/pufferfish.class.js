class Pufferfish extends Movable { // weitere Klasse "Enemy" erstellen, um auch andere Gegner einzubinden, ohne aber Code doppelt schreiben zu müssen??
    width = 75;
    height = 75;
    speed = -0.6 * (1 + Math.random());

    constructor() {
        super().loadImage('../img/enemy/1.Pufferfish/1.Swim/1.png');
        this.x = 150 + Math.random() * 500;
        this.y = 300 + Math.random() * 100;
        this.initFrame(3, 6, 65, 48);
        this.loadImages('normal', '../img/enemy/1.Pufferfish/1.Swim/', 5);
        this.loadImages('transition', '../img/enemy/1.Pufferfish/2.Transition/', 5);
        this.loadImages('blown', '../img/enemy/1.Pufferfish/3.Bubbleswim/', 5);
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
            this.frame[1] -= 4;
            this.frame[3] = 72;            
        }, 420);
    }
}