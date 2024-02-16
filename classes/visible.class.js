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
    singleAnimationId = -1;
    loopAnimation = true;
    frames = [];

    /**
     * constructor
     */
    constructor() {
        this.loadAnimations();
    }


    /**
     * load/create single image from file path
     * @param {String} path - image file path 
     */
    loadImage(path) {
        this.img = new Image();
        this.promise(this.img, path);
    }


    /**
     * load/create images for an animation
     * @param {String} name - animation name
     * @param {String} dir - directory of images
     * @param {Number} numberOfSprites - animation length/number of sprites
     */
    loadImages(name, dir, numberOfSprites) {
        this.imageCache[name] = [];
        for (let i = 1; i <= numberOfSprites; i++) {
            const path = dir + i + '.png';
            let img = new Image();
            this.promise(img, path);
            this.imageCache[name].push(img);
        }
    }


    /**
     * load all animations for this class (using data from 'js/path.js')
     */
    loadAnimations() {
        const classToString = this.constructor.name;
        if (animations[classToString]) {
            for (let i = 0; i < animations[classToString].length; i++) {
                const animation = animations[classToString][i];
                this.loadImages(animation[0], animation[1], animation[2]);
            }
        }
    }


    /**
     * create loading promise for image
     * @param {Object} img - image object 
     * @param {String} path - image file path
     */
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


    /**
     * finish loading image by resolving promise
     * @param {Promise} promise - loading promise for image 
     */
    resolve(promise) {
        promise.then(() => {
            loadingCounter++;
        });
    }


    /**
     * play cyclic animation
     * @param {String} name - animation name 
     * @param {Number} ms - frame interval in milliseconds
     */
    animate(name, ms) {
        const numberOfSprites = this.imageCache[name].length;
        this.activeAnimation = name;
        this.animateIntervalId = setInterval(() => {
            if (this.loopAnimation && !this.isDead()) {
                this.currentImg %= numberOfSprites;
                this.img = this.imageCache[name][this.currentImg];
                this.currentImg++;
            } else {
                this.currentImg = 0;
            }
        }, ms);
    }


    /**
     * play single animation
     * @param {String} name - animation name
     * @param {Number} ms - frame interval in milliseconds 
     */
    playAnimationOnce(name, ms) {
        this.loopAnimation = false;
        if (this.singleAnimationId != -1) {
            clearInterval(this.singleAnimationId);
        }
        this.setSingleInterval(name, ms);
    }


    /**
     * create interval for single animation
     * @param {String} name - animation name
     * @param {Number} ms - frame interval in milliseconds 
     */
    setSingleInterval(name, ms) {
        const numberOfSprites = this.imageCache[name].length;
        let i = 0;
        this.singleAnimationId = setInterval(() => {
            this.img = this.imageCache[name][i];
            i++;
            if (i == numberOfSprites) {
                this.stopSingleAnimation();
            }
        }, ms);
    }


    /**
     * stop single animation by clearing the corresponding interval
     */
    stopSingleAnimation() {
        clearInterval(this.singleAnimationId);
        this.singleAnimationId = -1;
        this.loopAnimation = true;
    }


    /**
     * draw object onto canvas
     * @param {CanvasRenderingContext2D} ctx - canvas context
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * add offset rectangle ('frame')
     * @param {Number} dX - x offset left
     * @param {Number} dY - y offset from the top
     * @param {Number} width - rectangle/frame width
     * @param {Number} height - rectangle/frame height
     */
    initFrame(dX, dY, width, height) {
        this.frames.push([dX, dY, width, height]);
    }


    /**
     * play single sound (from sound start)
     * @param {String} sound - sound name
     */
    playSound(sound) {
        if (settings['sound']) {
            this.sounds[sound].currentTime = 0;
            this.sounds[sound].play();
        }
    }


    /**
     * stop single sound
     * @param {String} sound - sound name
     */
    stopSound(sound) {
        if (settings['sound']) {
            this.sounds[sound].pause();
            this.sounds[sound].currentTime = 0;
        }
    }


    /**
     * play single sound after a given delay 
     * @param {Number} ms - delay in milliseconds
     * @param {String} sound - sound name
     */
    playSoundAfterDelay(ms, sound) {
        setTimeout(() => {
            if (settings['sound']) {
                this.playSound(sound);
            }
        }, ms);
    }
}