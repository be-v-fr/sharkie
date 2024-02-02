class Boss extends Movable {
    width = 360;
    height = 480;

    constructor(xStart) {
        super().loadImage('../img/enemy/3 Final Enemy/1.Introduce/1.png');
        this.x = -1000;
        this.xStart = xStart;
        this.y = 0;
        this.loadImages('introduce', '../img/enemy/3 Final Enemy/1.Introduce/', 10);
        this.loadImages('floating', '../img/enemy/3 Final Enemy/2.floating/', 13);
        this.loadImages('attack', '../img/enemy/3 Final Enemy/Attack/', 6);
        this.loadImages('dead', '../img/enemy/3 Final Enemy/Dead/', 6);
        this.loadImages('hurt', '../img/enemy/3 Final Enemy/Hurt/', 4);
        this.initFrame(30, 108, 90, 60);
    }

    spawn() {
        this.x = this.xStart;
        this.playAnimationOnce('introduce');
        const moveSpawning = setInterval(() => {
            this.x -= 0.8;
            if(this.x <= this.xStart - 14) {
                this.initCycle();
                clearInterval(moveSpawning);
            }
        }, 1000 / 60)
        this.animate('floating');
    }

    initCycle() {
        console.log('boss cycle initiated');
    }
}