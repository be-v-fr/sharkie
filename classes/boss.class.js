class Boss extends Movable {
    width = 360;
    height = 480;
    attackId = -1;
    xStartAbsolute;

    /**
     * Konstruktor
     * @param {Number} xStartAbsolute - absolute Startposition, in die die Relativbewegung des Bodens noch nicht eingerechnet wurde
     */
    constructor(xStartAbsolute) {
        super().loadImage('./img/enemy/boss/introduce/1.png');
        this.x = -1000;
        this.xStartAbsolute = xStartAbsolute;
        this.y = 0;
        this.setDamage(10, 20);
        if (settings['hardMode']) {
            this.health = 60;
        } else {
            this.health = 40;
        }
        this.recoveryDuration = 1800;
        this.initFrame(32, 240, 280, 140);
        this.initFrame(170, 170, 30, 100);
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
        if (this.attackId != -1) {
            clearInterval(this.attackId);
            this.attackId = -1;
        }
    }


    /**
     * Boss spawnen
     */
    spawn() {
        this.setSpawningPosition();
        this.startBossMusic();
        this.x = this.xStart;
        this.playAnimationOnceWithSound('introduce');
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
     * @param {Number} horizontal - Anzahl Iterationsschritte für x-Bewegung
     * @param {Number} vertical - Anzahl Iterationsschritte für y-Bewegung
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
     * @param {Number} horizontal - Anzahl Iterationsschritte für x-Bewegung
     * @param {Number} vertical - Anzahl Iterationsschritte für y-Bewegung
     */
    moveCycle(horizontal, vertical) {
        this.moveHorizontal(horizontal);
        this.moveVertical(vertical);
    }


    /**
     * x-Bewegungszyklus
     * @param {Number} index - Anzahl Iterationsschritte
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
     * @param {Number} index - Anzahl Iterationsschritte
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
     * @returns {Boolean} - Bedingung für neue Handlung erfüllt?
     */
    isReadyForAction() {
        return this.attackId == -1 && this.singleAnimationId == -1 && Date.now() - this.lastHit > this.recoveryDuration / 3;
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
        this.playAnimationOnceWithSound('attack');
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
     * @param {Number} index - aktueller Iterationsschritt
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
     * @param {Number} index - aktueller Iterationsschritt
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
     * @param {Number} index - aktueller Iterationsschritt
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
        this.attackId = -1;
    }


    /**
     * Treffer durch Objekt: Statusänderung, Bewegung und Animation
     * @param {Object} obj - verletzendes Objekt 
     */
    hit(obj) {
        super.hit(obj);
        this.stopSound('attack');
        if (!this.isDead()) {
            this.state = 'hit';
            this.clearBossIntervals();
            this.playAnimationOnceWithSound('hurt');
            this.retreat();
        }
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
     * @param {Number} speed - Tempo 
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
     * @param {Number} incline - Seitenverhältnis des y-Tempos zum x-Tempo
     * @param {Number} speed - Tempo 
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
            this.playAnimationOnceWithSound('die');
            this.endBossMusic();
            setTimeout(() => {
                world.win();
                this.clearAllIntervals();
            }, 1000);
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