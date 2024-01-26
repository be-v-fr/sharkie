class Coin extends Item {
    constructor(xStart, y) {
        super(xStart, y).loadImage('./img/marks/1.Coins/1.png');
        this.width = 32;
        this.height = 32;
        this.initFrame(0, 0, this.width, this.height);
        this.sounds = {
            'collect': new Audio('../audio/coin.mp3')
        };
    }
}