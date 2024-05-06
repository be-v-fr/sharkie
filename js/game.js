let canvas;
let overlay;
let keyboard = new Keyboard();
let level1;
let world = null;
let settings = {
    'sound': true,
    'music': true,
    'hardMode': false
};


/**
 * initialize game
 */
function init() {
    canvas = document.getElementById('canvas');
    overlay = document.getElementById('overlay');
    overlay.innerHTML = generateStartscreen();
    loadSettings();
    initMusic();
    initAnimationPaths();
    initSoundsPaths();
}


/**
 * start game by showing loading screen and start loading
 */
function start() {
    document.getElementById('creditsLink').classList.add('disabledLink');
    overlay.innerHTML = generateLoadingscreen();
    setTimeout(() => load(), 500);
}


/**
 * load images
 */
function load() {
    const loadingBar = document.getElementById('loadingBar');
    toggleMobile(false);
    addResizeListener();
    preload();
    generateLevel1();
    world = new World(canvas, keyboard);
    const waitUntilLoaded = setInterval(() => {
        loadingBar.style.width = getLoadingProgress() + '%';
        if (isLoaded()) {
            clearInterval(waitUntilLoaded);
            world.start();
            renderIngameOverlay();
        }
    }, 10);
}


/**
 * load images from classes not instantialized by the World constructor
 */
function preload() {
    new Bubble(0, 0, false, 0);
    new Bubble(0, 0, true, 0);
}


/**
 * request loading progress
 * @returns {Number} progress as percentage value
 */
function getLoadingProgress() {
    return 100 * loadingCounter / TOTAL_NR_OF_IMAGES;
}


/**
 * request if loading is complete
 * @returns {Boolean} true = complete, false = incomplete
 */
function isLoaded() {
    return loadingCounter >= TOTAL_NR_OF_IMAGES;
}


/**
 * render ingame interface to overlay
 */
function renderIngameOverlay() {
    overlay.classList.remove('overlayBg');
    overlay.innerHTML = generateIngameControls();
    renderIngameControls();
}


/**
 * show settings menu page
 */
function showSettings() {
    overlay.innerHTML = generateMenuSettings();
    renderMenuSettings();
    goToMenuSubpage();
}


/**
 * this function handles going from the main menu page to a subpage
 */
function goToMenuSubpage() {
    toggleMobile(false);
    addMenuListeners();
    addResizeListener();
}


/**
 * this function handles going from a menu subpage back to the main page
 */
function returnToMain() {
    overlay.innerHTML = generateStartscreen();
    removeMenuListeners();
    toggleMobile(true);
}


/**
 * set sound on/off (in menu)
 * @param {Boolean} on - true = on, false = off
 */
function setSound(on) {
    settings['sound'] = on;
    if (!settings['sound']) {
        setMusic(false);
    }
}


/**
 * set music on/off (in menu)
 * @param {Boolean} on - true = on, false = off
 */
function setMenuMusic(on) {
    if (settings['sound']) {
        setMusic(on);
    }
}


/**
 * set music on/off (called both ingame and from menu)
 * @param {Boolean} on - true = on, false = off
 */
function setMusic(on) {
    settings['music'] = on;
    if (on) {
        settings['sound'] = true;
        music['main'].volume = 0.14;
        music['boss'].volume = 0.23;
    } else {
        music['main'].volume = 0;
        music['boss'].volume = 0;
    }
}


/**
 * toggle sound (ingame)
 */
function toggleIngameSound() {
    const btn = document.getElementById('ingameSoundBtn');
    settings['sound'] = !settings['sound'];
    settings['music'] = settings['sound'];
    setMusic(settings['music']);
    updateSettings(true);
    btn.blur();
}


/**
 * toggle music (ingame)
 */
function toggleIngameMusic() {
    const btn = document.getElementById('ingameMusicBtn');
    settings['music'] = !settings['music'];
    setMusic(settings['music']);
    updateSettings(true);
    btn.blur();
}


/**
 * set game difficulty
 * @param {Boolean} on - true = hard, false = normal 
 */
function setHardMode(on) {
    settings['hardMode'] = on;
}


/**
 * update settings buttons and save information after change
 * @param {Boolean} ingame - true = ...ingame, false = ...in menu
 */
function updateSettings(ingame) {
    if (ingame) {
        renderIngameControls();
    } else {
        renderMenuSettings();
    }
    saveSettings();
}


/**
 * render ingame settings buttons
 */
function renderIngameControls() {
    const soundImg = document.getElementById('ingameSoundBtnImg');
    const musicImg = document.getElementById('ingameMusicBtnImg');
    if (settings['sound']) {
        soundImg.src = './img/marks/icons/sound.svg';
        if (settings['music']) {
            musicImg.src = './img/marks/icons/music.svg';
        } else {
            musicImg.src = './img/marks/icons/music_disabled.svg';
        }
    } else {
        soundImg.src = './img/marks/icons/sound_disabled.svg';
        musicImg.src = './img/marks/icons/music_disabled.svg';
    }
}


/**
 * render menu settings
 */
function renderMenuSettings() {
    const sound0 = document.getElementById('sound0');
    const sound1 = document.getElementById('sound1');
    const music0 = document.getElementById('music0');
    const music1 = document.getElementById('music1');
    const hardMode0 = document.getElementById('hardMode0');
    const hardMode1 = document.getElementById('hardMode1');
    clearSettingsBtnClasses([sound0, sound1, music0, music1, hardMode0, hardMode1]);
    styleSettingsBtns('sound', sound0, sound1);
    if (settings['sound']) {
        styleSettingsBtns('music', music0, music1);
    }
    styleSettingsBtns('hardMode', hardMode0, hardMode1);
}


/**
 * delete certain CSS classes from buttons on settings menu subpage
 * @param {Array} btns - button elements
 */
function clearSettingsBtnClasses(btns) {
    for (let i = 0; i < btns.length; i++) {
        const btn = btns[i];
        btn.classList.remove('settingsBtnActive', 'settingsBtnInactive');
    }
}


/**
 * add certain CSS classes to buttons on settings menu subpage
 * @param {String} key - setting parameter (JSON key from 'settings' array) 
 * @param {*} btn0 - button for setting parameter to 'off'
 * @param {*} btn1 - button for setting parameter to 'on'
 */
function styleSettingsBtns(key, btn0, btn1) {
    if (settings[key]) {
        btn0.classList.add('settingsBtnInactive');
        btn1.classList.add('settingsBtnActive');
    } else {
        btn1.classList.add('settingsBtnInactive');
        btn0.classList.add('settingsBtnActive');
    }
}


/**
 * show instructions menu subpage
 */
function showInstructions() {
    overlay.innerHTML = generateInstructions();
    goToMenuSubpage();
}


/**
 * show endscreen (win/lose)
 * @param {String} message - endscreen message 
 */
function showEndscreen(message) {
    overlay.innerHTML = generateEndscreen(message);
    document.addEventListener('click', endGame);
    document.addEventListener('keypress', endGame);
}


/**
 * end game by returning from endscreen to startscreen
 */
function endGame() {
    document.removeEventListener('click', endGame);
    document.removeEventListener('keypress', endGame);
    resetMusic();
    world.ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = null;
    overlay.classList.add('overlayBg');
    document.getElementById('creditsLink').classList.remove('disabledLink');
    returnToMain();
}


/**
 * show credits on canvas overlay if not ingame
 */
function showCredits() {
    if (!world) {
        addMenuListeners();
        overlay.innerHTML = generateCredits();
    }
}