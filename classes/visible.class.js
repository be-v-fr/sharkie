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
     * Konstruktor
     */
    constructor() {
        this.loadAnimations();
    }


    /**
     * einzelnes Bild laden
     * @param {String} path - Dateipfad 
     */
    loadImage(path) {
        this.img = new Image();
        this.promise(this.img, path);
    }


    /**
     * Bilder für Animation laden
     * @param {String} name - Name der Animation
     * @param {String} dir - Ordnerpfad
     * @param {Number} numberOfSprites - Länge der Animation/Anzahl Sprites
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
     * alle Animationen laden (Daten aus path.js)
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
     * Ladevorgang für Bild einrichten
     * @param {Object} img - Image-Objekt 
     * @param {String} path - Dateipfad des Bildes
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
     * Ladevorgang abschließen
     * @param {Promise} promise - Ladevorgang des Bildes 
     */
    resolve(promise) {
        promise.then(() => {
            loadingCounter++;
        });
    }


    /**
     * zyklische Animation abspielen
     * @param {String} name - Name der Animation 
     */
    animate(name) {
        const numberOfSprites = this.imageCache[name].length;
        this.activeAnimation = name;
        this.animateIntervalId = setInterval(() => {
            if (this.loopAnimation && !this.isDead()) {
                this.currentImg %= numberOfSprites;
                this.img = this.imageCache[name][this.currentImg];
                this.currentImg++;
            }
        }, 1000 / 8);
    }


    /**
     * einzelne Animation abspielen
     * @param {String} name - Name der Animation 
     */
    playAnimationOnce(name) {
        this.loopAnimation = false;
        if (this.singleAnimationId != -1) {
            clearInterval(this.singleAnimationId);
        }
        this.setSingleInterval(name);
    }


    /**
     * Intervall für einmalige Animation setzen
     * @param {String} name - Name der Animation 
     */
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


    /**
     * Intervall für einmalige Animation stoppen
     */
    stopSingleAnimation() {
        clearInterval(this.singleAnimationId);
        this.singleAnimationId = -1;
        this.loopAnimation = true;
    }


    /**
     * Objekt auf Canvas zeichnen
     * @param {CanvasRenderingContext2D} ctx - Context des Canvas 
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Offset-Frame hinzufügen
     * @param {Number} dX - x-Offset
     * @param {Number} dY - y-Offset
     * @param {Number} width - Breite des Frames
     * @param {Number} height - Höhe des Frames
     */
    initFrame(dX, dY, width, height) {
        this.frames.push([dX, dY, width, height]);
    }


    /**
     * Sound abspielen
     * @param {String} sound - Name des Sounds
     */
    playSound(sound) {
        if (settings['sound']) {
            this.sounds[sound].currentTime = 0;
            this.sounds[sound].play();
        }
    }


    /**
     * Sound stoppen
     * @param {String} sound - Name des Sounds
     */
    stopSound(sound) {
        if (settings['sound']) {
            this.sounds[sound].pause();
            this.sounds[sound].currentTime = 0;
        }
    }


    /**
     * Sound nach Verzögerung abspielen
     * @param {Number} ms - Verzögerung in Millisekunden
     * @param {String} sound - Name des Sounds
     */
    playSoundAfterDelay(ms, sound) {
        setTimeout(() => {
            if (settings['sound']) {
                this.playSound(sound);
            }
        }, ms);
    }
}