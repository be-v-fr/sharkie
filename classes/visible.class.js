class Visible {
    img;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    imageCache = {};
    currentImg = 0;
    state = '';
    animateIntervalId;
    activeAnimation = '';
    loopAnimation = true;
    frames = [];

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

    loadingNow(object) {
        const loadingObj = document.getElementById('loadingObj');
        loadingObj.innerHTML = object;
    }

    animate(name) {
        const numberOfSprites = this.imageCache[name].length;
        this.activeAnimation = name;
        this.animateIntervalId = setInterval(() => {
            if (this.loopAnimation) {
                this.currentImg %= numberOfSprites;
                this.img = this.imageCache[name][this.currentImg];
                this.currentImg++;
            }
        }, 1000 / 8);
    }

    playAnimationOnce(name) {
        const numberOfSprites = this.imageCache[name].length;
        this.loopAnimation = false;
        let i = 0;
        let interval = setInterval(() => {
            console.log('Interval', interval, 'created');
            this.img = this.imageCache[name][i];
            i++;
            if (i == numberOfSprites) {
                clearInterval(interval);
                console.log('Interval', interval, 'cleared');
                this.loopAnimation = true;
            }
        }, 1000 / 12);
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    initFrame(dX, dY, width, height) {
        this.frames.push([dX, dY, width, height]);
    }

    drawFrame(ctx) {
        if (!(this instanceof Backdrop || this instanceof Stats)) {
            this.frames.forEach(f => {
                ctx.beginPath();
                ctx.rect(this.x + f[0], this.y + f[1], f[2], f[3]);
                ctx.stroke();
            });
        }
    }

    playSound(sound) {
        this.sounds[sound].currentTime = 0;
        this.sounds[sound].play();
    }
}