class World {
    canvas;
    keyboard;
    ctx;
    backdrop = level1.backdrop;
    backdropUnits = level1.backdropUnits;
    length = level1.length;
    light = new Backdrop(4, 0);
    character = new Character();
    translateX = -this.character.xStart;
    floor = level1.floor; // absolute Char-Position: character.x -
    dX = this.character.x - this.character.xStart - this.floor.x;
    enemies = level1.enemies;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.floor.moveX(-this.floor.speed);
        this.draw();
        this.set();
    }

    set() {
        setInterval(() => {
            this.character.world = this;
            this.translateX = this.character.x - this.character.xStart;
            this.dX = this.character.x - this.character.xStart - this.floor.x;
            this.character.act();
            this.setBackdrop();
        }, 5);
    }

    setBackdrop() {
        this.setFloor();
        for (let i = 0; i < this.backdrop.length; i++) {
            const layer = this.backdrop[i];
            if (layer != this.floor) {
                layer.x = layer.xStart + this.floor.x * layer.speedFactor;
            }
        }
    }

    setFloor() {
        if(this.character.state == 'swim left' && this.floor.speed > 0) {
            this.floor.turnAround();
        } else {
            if(this.floor.speed < 0) {
                this.floor.turnAround();            
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.translate(-this.translateX, 0);
        this.addBackdrop();
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.ctx.translate(this.translateX, 0);
        this.recallDraw();
    }

    addBackdrop() {
        this.addObjectsToMap(this.backdrop);
    }

    addObjectsToMap(obj) {
        obj.forEach(o => { this.addToMap(o) });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            this.unflipImage();
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(2 * mo.x + mo.width, 0);
        this.ctx.scale(-1, 1);
    }

    unflipImage() {
        this.ctx.restore();
    }

    recallDraw() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}