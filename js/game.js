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
 * Initialisierung
 */
function init() {
    canvas = document.getElementById('canvas');
    overlay = document.getElementById('overlay');
    overlay.innerHTML = generateStartscreen();
    loadSettings();
    initMusic();
}


/**
 * Spiel starten
 */
function start() {
    overlay.innerHTML = generateLoadingscreen();
    setTimeout(() => load(), 500);
}


/**
 * Bilddateien laden
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
 * Bilddateien von Klassen laden, die nicht mit dem world-Konstruktor instanziiert werden
 */
function preload() {
    new Bubble(0, 0, false, 0);
    new Bubble(0, 0, true, 0);
}


/**
 * Ladefortschritt abfragen
 * @returns {Number} prozentualer Fortschritt
 */
function getLoadingProgress() {
    return 100 * loadingCounter / TOTAL_NR_OF_IMAGES;
}


/**
 * Abfrage, ob Laden abgeschlossen wurde
 * @returns {Boolean} true = abgeschlossen, false = nicht abgeschlossen
 */
function isLoaded() {
    return loadingCounter >= TOTAL_NR_OF_IMAGES;
}


/**
 * Ingame-Interface ins Overlay rendern
 */
function renderIngameOverlay() {
    overlay.classList.remove('overlayBg');
    overlay.innerHTML = generateIngameControls();
    renderIngameControls();
}


/**
 * Menüseite "Settings" anzeigen
 */
function showSettings() {
    overlay.innerHTML = generateMenuSettings();
    renderMenuSettings();
    goToMenuSubpage();
}


/**
 * Menüseite aufrufen
 */
function goToMenuSubpage() {
    toggleMobile(false);
    addMenuListeners();
    addResizeListener();
}


/**
 * zurück zum Hauptmenü
 */
function returnToMain() {
    overlay.innerHTML = generateStartscreen();
    removeMenuListeners();
    toggleMobile(true);
}


/**
 * Sound an/aus (im Menü)
 * @param {Boolean} on - true = an, false = aus
 */
function setSound(on) {
    settings['sound'] = on;
    if (!settings['sound']) {
        setMusic(false);
    }
}


/**
 * Musik an/aus (im Menü)
 * @param {Boolean} on - true = an, false = aus
 */
function setMenuMusic(on) {
    if (settings['sound']) {
        setMusic(on);
    }
}


/**
 * Musik an/aus (ingame)
 * @param {Boolean} on - true = an, false = aus
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
 * Sound togglen (ingame)
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
 * Musik togglen (ingame)
 */
function toggleIngameMusic() {
    const btn = document.getElementById('ingameMusicBtn');
    settings['music'] = !settings['music'];
    setMusic(settings['music']);
    updateSettings(true);
    btn.blur();
}


/**
 * Schwierigkeit festlegen
 * @param {Boolean} on - true = schwer, false = normal 
 */
function setHardMode(on) {
    settings['hardMode'] = on;
}


/**
 * Settings aktualisieren...
 * @param {Boolean} ingame - true = ...im Spiel, false = ...im Menü
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
 * Buttons für Ingame-Settings rendern
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
 * Buttons für Menü-Settings rendern
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
 * bestimmte CSS-Klassen von Buttons der Settings-Menüseite löschen
 * @param {Array} btns - Button-Elemente
 */
function clearSettingsBtnClasses(btns) {
    for (let i = 0; i < btns.length; i++) {
        const btn = btns[i];
        btn.classList.remove('settingsBtnActive', 'settingsBtnInactive');
    }
}


/**
 * bestimmte CSS-Klassen zu Buttons der Settings-Menüseite zuweisen
 * @param {String} key - Einstellungsparameter (JSON-Key aus settings-Array) 
 * @param {*} btn0 - Button für Einstellung "aus"
 * @param {*} btn1 - Button für Einstellung "an"
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
 * Anleitung anzeigen
 */
function showInstructions() {
    overlay.innerHTML = generateInstructions();
    goToMenuSubpage();
}


/**
 * Endscreen anzeigen
 * @param {String} message - Nachricht 
 */
function showEndscreen(message) {
    overlay.innerHTML = generateEndscreen(message);
    document.addEventListener('click', endGame);
    document.addEventListener('keypress', endGame);
}


/**
 * Spiel beenden
 */
function endGame() {
    document.removeEventListener('click', endGame);
    document.removeEventListener('keypress', endGame);
    resetMusic();
    world.ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = null;
    overlay.classList.add('overlayBg');
    returnToMain();
}