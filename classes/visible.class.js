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
    singleAnimationId = '';
    loopAnimation = true;
    frames = [];

    loadImage(path) {
        this.img = new Image();
        this.promise(this.img, path);
    }

    loadImages(name, dir, numberOfSprites) {
        this.imageCache[name] = [];
        for (let i = 1; i <= numberOfSprites; i++) {
            const path = dir + i + '.png';
            let img = new Image();
            this.promise(img, path);
            this.imageCache[name].push(img);
        }
    }

    promise(img, path) {
        const loading = new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = path;
        });
        if (!isLoaded() && !imagePaths.includes(path)) {
            imagePaths.push(path);
            this.resolve(loading);
        }
    }

    resolve(promise) {
        promise.then(() => {
            loadingCounter++;
        });
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
        this.loopAnimation = false;
        if (this.singleAnimationId != '') {
            clearInterval(this.singleAnimationId);
        }
        this.setSingleInterval(name);
    }

    setSingleInterval(name) {
        const numberOfSprites = this.imageCache[name].length;
        let i = 0;
        this.singleAnimationId = setInterval(() => {
            this.img = this.imageCache[name][i];
            i++;
            if (i == numberOfSprites) {
                this.stopSingleAnimation();
            }
        }, 1000 / 12);
    }

    stopSingleAnimation() {
        clearInterval(this.singleAnimationId);
        this.singleAnimationId = '';
        this.loopAnimation = true;
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
        if (settings['sound']) {
            this.sounds[sound].currentTime = 0;
            this.sounds[sound].play();
        }
    }

    stopSound(sound) {
        if (settings['sound']) {
            this.sounds[sound].pause();
            this.sounds[sound].currentTime = 0;
        }        
    }

    playSoundAfterDelay(ms, sound) {
        setTimeout(() => {
            if (settings['sound']) {
                this.playSound(sound);
            }
        }, ms);
    }
}