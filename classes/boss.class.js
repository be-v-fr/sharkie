class Boss extends Movable {
    width = 360;
    height = 480;
    attackId = '';

    constructor(xStart) {
        super().loadImage('../img/enemy/3 Final Enemy/1.Introduce/1.png');
        this.x = -1000;
        this.xStart = xStart;
        this.y = 0;
        this.damage = 8;
        this.recoveryDuration = 1800;
        this.loadImages('introduce', '../img/enemy/3 Final Enemy/1.Introduce/', 10);
        this.loadImages('floating', '../img/enemy/3 Final Enemy/2.Floating/', 13);
        this.loadImages('attack', '../img/enemy/3 Final Enemy/Attack/', 6);
        this.loadImages('die', '../img/enemy/3 Final Enemy/Dead/', 6);
        this.loadImages('hurt', '../img/enemy/3 Final Enemy/Hurt/', 4);
        this.initFrame(32, 240, 280, 140);
        this.initFrame(170, 170, 30, 100);
        this.sounds = {
            'intro': new Audio('../audio/boss_splash.mp3'),
            'attack': new Audio('../audio/boss_bite.mp3'),
            'hurt': new Audio('../audio/boss_hurt.mp3'),
            'die': new Audio('../audio/boss_die.mp3')
        };
    }

    clearAllIntervals() {
        this.clearIntervals();
        this.clearBossIntervals();
    }

    clearBossIntervals() {
        clearInterval(this.moveIntervalId);
        if (this.attackId != '') {
            clearInterval(this.attackId);
        }
    }

    spawn() {
        this.startBossMusic();
        this.playSound('intro');
        this.x = this.xStart;
        this.playAnimationOnce('introduce');
        const moveSpawning = setInterval(() => {
            this.x -= 0.8;
            if (this.x <= this.xStart - 14) {
                this.setCycle(0, 0);
                clearInterval(moveSpawning);
            }
        }, 1000 / 60)
        this.animate('floating');
    }

    startBossMusic() {
        music['main'].pause();
        music['boss'].play();
    }

    setCycle(horizontal, vertical) {
        this.moveIntervalId = setInterval(() => {
            horizontal %= 150;
            vertical %= 130;
            this.moveCycle(horizontal, vertical);
            horizontal++;
            vertical++;
            this.act();
        }, 1000 / 30);
    }

    moveCycle(horizontal, vertical) {
        this.moveHorizontal(horizontal);
        this.moveVertical(vertical);
    }

    moveHorizontal(index) {
        if (index < 120) {
            this.x -= 2;
        } else {
            this.x += 8;
        }
    }

    moveVertical(index) {
        if (index < 65) {
            this.y -= 3;
        } else {
            this.y += 3;
        }
    }

    act() {
        if (this.isReadyForAction()) {
            this.setDirection();
            if (Math.random() < 0.02) {
                this.attack();
            }
        }
    }

    isReadyForAction() {
        return this.attackId == '' && this.singleAnimationId == '' && this.isRecovered();
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
        this.playSound('attack');
        let i = 0;
        this.attackId = setInterval(() => {
            this.attackMove(i);
            i++;
            if (i == 36) {
                this.finishAttack();
            }
        }, 1000 / 30)
    }

    attackMove(index) {
        if (index < 18) {
            this.startAttack(index);
        } else {
            this.endAttack(index);
        }
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

    finishAttack() {
        clearInterval(this.attackId);
        this.attackId = '';
    }

    hurt() {
        this.clearBossIntervals();
        this.playAnimationOnce('hurt');
        this.playSound('hurt');
        this.retreat();
    }

    retreat() {
        let speed = Math.abs(this.x - this.xStart);
        const incline = Math.abs(this.y / speed);
        speed /= 40;
        this.moveIntervalId = setInterval(() => {
            this.retreatX(speed);
            this.retreatY(incline, speed);
            if (this.x == this.xStart && this.y == 0) {
                clearInterval(this.moveIntervalId);
                this.state = '';
                this.setCycle(0, 0);
            }
        }, 1000 / 60);
    }

    retreatX(speed) {
        if (this.x <= this.xStart - speed) {
            this.x += speed;
        } else if (this.x >= this.xStart + speed) {
            this.x -= speed;
        } else {
            this.x = this.xStart;
        }
    }

    retreatY(incline, speed) {
        if (this.y <= -speed) {
            this.y += speed * incline;
        } else if (this.y >= speed) {
            this.y -= speed * incline;
        } else {
            this.y = 0;
        }
    }

    die() {
        this.clearAllIntervals();
        this.playAnimationOnce('die');
        this.playSound('die');
        music['boss'].pause();
        music['main'].currentTime = 0;
        music['main'].play();           
        setTimeout(() => {
            world.stop = true;
        }, 500);
        // Winning-Screen
    }
}