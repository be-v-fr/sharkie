class Boss extends Movable {
    width = 360;
    height = 480;
    cycleId = '';
    attackId = '';

    constructor(xStart) {
        super().loadImage('../img/enemy/3 Final Enemy/1.Introduce/1.png');
        this.x = -1000;
        this.xStart = xStart;
        this.y = 0;
        this.damage = 8;
        this.loadImages('introduce', '../img/enemy/3 Final Enemy/1.Introduce/', 10);
        this.loadImages('floating', '../img/enemy/3 Final Enemy/2.floating/', 13);
        this.loadImages('attack', '../img/enemy/3 Final Enemy/Attack/', 6);
        this.loadImages('dead', '../img/enemy/3 Final Enemy/Dead/', 6);
        this.loadImages('hurt', '../img/enemy/3 Final Enemy/Hurt/', 4);
        this.initFrame(32, 240, 280, 140);
        this.initFrame(170, 170, 30, 100);
    }

    spawn() {
        this.x = this.xStart;
        this.playAnimationOnce('introduce');
        const moveSpawning = setInterval(() => {
            this.x -= 0.8;
            if (this.x <= this.xStart - 14) {
                this.initCycle();
                clearInterval(moveSpawning);
            }
        }, 1000 / 60)
        this.animate('floating');
        console.log('floating');
    }

    initCycle() {
        let i = 0;
        let j = 0;
        this.cycleId = setInterval(() => {
            i %= 150;
            j %= 130;
            if (i++ < 120) {
                this.x -= 2;
            } else {
                this.x += 8;
            }
            if (j++ < 65) {
                this.y -= 3;
            } else {
                this.y += 3;
            }
            if (this.attackId == '' && this.singleAnimationId == '') {
                this.setDirection();
                if (Math.random() < 0.018) {
                    this.attack();
                }
            }
        }, 1000 / 30)

    }

    setDirection() {
        if (world.character.x > this.x + 100) {
            this.otherDirection = true;
        } else {
            this.otherDirection = false;
        }
    }

    attack() {
        this.playAnimationOnce('attack');
        let i = 0;
        this.attackId = setInterval(() => {
            if (i < 18) {
                this.startAttack(i++);
            } else {
                this.endAttack(i++);
            }
            if (i == 36) {
                clearInterval(this.attackId);
                this.attackId = '';
            }
        }, 1000 / 30)
    }

    startAttack(index) {
        if (this.otherDirection) {
            this.x += index;
        } else {
            this.x -= index;
        }
    }

    endAttack(index) {
        if (this.otherDirection) {
            this.x -= (index - 18);
        } else {
            this.x += (index - 18);
        }
    }
}