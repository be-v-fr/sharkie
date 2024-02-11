class Boss extends Movable {
    width = 360;
    height = 480;
    attackId = '';
    xStartAbsolute;

    /**
     * Konstruktor
     * @param {number} xStartAbsolute - absolute Startposition, in die die Relativbewegung des Bodens noch nicht eingerechnet wurde
     */
    constructor(xStartAbsolute) {
        super().loadImage('../img/enemy/3 Final Enemy/1.Introduce/1.png');
        this.x = -1000;
        this.xStartAbsolute = xStartAbsolute;
        this.y = 0;
        if (settings['hardMode']) {
            this.damage = 20;
            this.health = 60;
        } else {
            this.damage = 10;
            this.health = 40;
        }
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


    /**
     * alle Bewegungs- und Animationsintervalle löschen
     */
    clearAllIntervals() {
        this.clearIntervals();
        this.clearBossIntervals();
    }


    /**
     * für den Boss spezielle Bewegungsintervalle löschen
     */
    clearBossIntervals() {
        clearInterval(this.moveIntervalId);
        if (this.attackId != '') {
            clearInterval(this.attackId);
            this.attackId = '';
        }
    }


    /**
     * Boss spawnen
     */
    spawn() {
        this.setSpawningPosition();
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


    /**
     * relative x-Koordinate des Spawning-Punkts festlegen 
     */
    setSpawningPosition() {
        this.xStart = this.xStartAbsolute + world.floor.x;
    }


    /**
     * Musik-Track wechseln
     */
    startBossMusic() {
        music['main'].pause();
        music['boss'].play();
    }


    /**
     * Grundzyklus der Boss-Bewegung und -Aktionen
     * @param {number} horizontal - Anzahl Iterationsschritte für x-Bewegung
     * @param {number} vertical - Anzahl Iterationsschritte für y-Bewegung
     */
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


    /**
     * Bewegungszyklus
     * @param {number} horizontal - Anzahl Iterationsschritte für x-Bewegung
     * @param {number} vertical - Anzahl Iterationsschritte für y-Bewegung
     */
    moveCycle(horizontal, vertical) {
        this.moveHorizontal(horizontal);
        this.moveVertical(vertical);
    }


    /**
     * x-Bewegungszyklus
     * @param {number} index - Anzahl Iterationsschritte
     */
    moveHorizontal(index) {
        if (index < 120) {
            this.x -= 2;
        } else {
            this.x += 8;
        }
    }


    /**
     * y-Bewegungszyklus
     * @param {number} index - Anzahl Iterationsschritte
     */
    moveVertical(index) {
        if (index < 65) {
            this.y -= 3;
        } else {
            this.y += 3;
        }
    }


    /**
     * Handlungen ausführen (mögliche Handlungen: 1. attackieren, 2. zum Character drehen)
     */
    act() {
        if (this.isReadyForAction()) {
            this.setDirection();
            if (Math.random() < 0.03) {
                this.attack();
            }
        }
    }


    /**
     * Abfrage der Handlungsfähigkeit
     * @returns {boolean} - Bedingung für neue Handlung erfüllt?
     */
    isReadyForAction() {
        return this.attackId == '' && this.singleAnimationId == '' && Date.now() - this.lastHit > this.recoveryDuration / 3;
    }


    /**
     * Boss nach Character-Position ausrichten
     */
    setDirection() {
        if (world.character.x > this.x + 100) {
            this.otherDirection = true;
        } else {
            this.otherDirection = false;
        }
    }


    /**
     * Attacke ausführen
     */
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


    /**
     * Bewegungsschritt der Attacke
     * @param {number} index - aktueller Iterationsschritt
     */
    attackMove(index) {
        if (index < 18) {
            this.startAttack(index);
        } else {
            this.endAttack(index);
        }
    }


    /**
     * Bewegungsschritt in erster (Start-)Phase der Attacke
     * @param {number} index - aktueller Iterationsschritt
     */
    startAttack(index) {
        if (this.otherDirection) {
            this.x += index;
        } else {
            this.x -= index;
        }
    }


    /**
     * Bewegungsschritt in zweiter (Schluss-)Phase der Attacke
     * @param {number} index - aktueller Iterationsschritt
     */
    endAttack(index) {
        if (this.otherDirection) {
            this.x -= (index - 18);
        } else {
            this.x += (index - 18);
        }
    }


    /**
     * Attacke löschen
     */
    finishAttack() {
        clearInterval(this.attackId);
        this.attackId = '';
    }


    /**
     * Verletzung: Statusänderung, Bewegung und Animation
     */
    hurt() {
        this.clearBossIntervals();
        this.stopSound('attack');
        this.playAnimationOnce('hurt');
        this.playSound('hurt');
        this.retreat();
    }


    /**
     * Rückzug zum Spawning-Punkt
     */
    retreat() {
        let speed = Math.abs(this.x - this.xStart);
        const incline = Math.abs(this.y / speed);
        speed /= 40;
        this.moveIntervalId = setInterval(() => {
            this.retreatX(speed);
            this.retreatY(incline, speed);
            if (this.x == this.xStart && this.y == 0) {
                this.restartCycle();
            }
        }, 1000 / 60);
    }


    /**
     * x-Bewegung des Rückzugs
     * @param {number} speed - Tempo 
     */
    retreatX(speed) {
        if (this.x <= this.xStart - speed) {
            this.x += speed;
        } else if (this.x >= this.xStart + speed) {
            this.x -= speed;
        } else {
            this.x = this.xStart;
        }
    }


    /**
     * y-Bewegung des Rückzugs
     * @param {number} incline - Seitenverhältnis des y-Tempos zum x-Tempo
     * @param {number} speed - Tempo 
     */
    retreatY(incline, speed) {
        if (this.y <= -speed) {
            this.y += speed * incline;
        } else if (this.y >= speed) {
            this.y -= speed * incline;
        } else {
            this.y = 0;
        }
    }


    /**
     * Zyklus neu starten
     */
        restartCycle() {
            clearInterval(this.moveIntervalId);
            this.state = '';
            this.setCycle(0, 0);
        }


    /** 
     * Sterben
    */
    die() {
        if (this.state != 'dead') {
            this.state = 'dead';
            this.clearAllIntervals();
            this.playAnimationOnce('die');
            this.playSound('die');
            this.endBossMusic();
            setTimeout(() => {
                world.win();
            }, 700);
        }
    }


    /**
     * von Bossmusik zu normaler Musik wechseln
     */
    endBossMusic() {
        music['boss'].pause();
        music['main'].currentTime = 0;
        music['main'].play();
    }
}