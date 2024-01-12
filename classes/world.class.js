class World {
    ctx;
    character = new Character(100, 100);
    enemies = [
        new Pufferfish(300, 300),
        new Pufferfish(320, 280),
        new Pufferfish(340, 340)
    ];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.draw();
    }

    draw() {
            const char = this.character;
            this.ctx.drawImage(char.img, char.x, char.y, char.width, char.height);
            for (let i = 0; i < this.enemies.length; i++) {
                const enemy = this.enemies[i];
                this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
            }
    }
}