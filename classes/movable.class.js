class Movable {
    img;
    x = 0;
    xStart;
    y = 0;
    width = 0;
    height = 0;
    speed = 0;
    imageCache = {};
    currentImg = 0;
    state = '';
    animateIntervalId;
    moveIntervalId;
    otherDirection = false;
    sounds = {};

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(name, dir, numberOfSprites) {
        this.imageCache[name] = [];
        for (let i = 1; i <= numberOfSprites; i++) {
            const path = dir + i + '.png';
            let img = new Image();
            img.src = path;
            this.imageCache[name].push(img);
        }
    }

    animate(name) {
        const numberOfSprites = this.imageCache[name].length;
        this.currentImg = 0;
        this.animateIntervalId = setInterval(() => {
            this.currentImg %= numberOfSprites;
            this.img = this.imageCache[name][this.currentImg];
            this.currentImg++;
        }, 1000 / 8);
    }

    moveX(speed) {
        if(this.otherDirection) {
            speed = -speed;
        }
        this.moveIntervalId = setInterval(() => {
            this.x += speed;
        }, 1000 / 60);
    }

    playSound(sound) {
        this.sounds[sound].currentTime = 0;
        this.sounds[sound].play();
    }
}