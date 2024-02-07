let canvas;
let overlay;
let keyboard = new Keyboard();
let level1;
let world;
let settings = {
    'sound': true,
    'music': true,
    'hardMode': false
};

function init() {
    canvas = document.getElementById('canvas');
    overlay = document.getElementById('overlay');
    overlay.innerHTML = generateStartscreen();
    loadSettings();
    initMusic();
}

function start() {
    overlay.innerHTML = generateLoadingscreen();
    load();
}

function load() {
    const loadingBar = document.getElementById('loadingBar');
    preload();
    generateLevel1();
    world = new World(canvas, keyboard);
    const waitUntilLoaded = setInterval(() => {
        loadingBar.style.width = loadingProgress() + '%';
        if (isLoaded()) {
            clearInterval(waitUntilLoaded);
            world.start();
            renderIngameOverlay();
        }
    }, 10);
}

function preload() {
    new Bubble(0, 0, false, 0);
    new Bubble(0, 0, true, 0);
}

function loadingProgress() {
    return 100 * loadingCounter / TOTAL_NR_OF_IMAGES;
}

function isLoaded() {
    return loadingCounter >= TOTAL_NR_OF_IMAGES;
}

function renderIngameOverlay() {
    overlay.classList.toggle('overlayBg');
    overlay.innerHTML = generateIngameSettings();
}

function showSettings() {
    overlay.innerHTML = generateMenuSettings();
    renderSettings();
    addReturnListener();
}

function addReturnListener() {
    overlay.addEventListener('mouseup', returnToMain);
}

function returnToMain() {
    overlay.innerHTML = generateStartscreen();
    overlay.removeEventListener('mouseup', returnToMain);
}

function setSound(on) {
    settings['sound'] = on;
    settings['music'] = on;
}

function setMusic(on) {
    settings['music'] = on;
    if (on && settings['sound']) {
        turnMusicOn();
    } else {
        turnMusicOff();
    }
}

function setIngameMusic() {
    if (settings['music']) {
        settings['sound'] = true;
        music['main'].volume = 0.14;
        music['boss'].volume = 0.23;
    } else {
        music['main'].volume = 0;
        music['boss'].volume = 0;
    }
}

function setHardMode(on) {
    settings['hardMode'] = on;
}

function updateSettings() {
    renderSettings();
    saveSettings();
}

function renderSettings() {
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

function clearSettingsBtnClasses(btns) {
    for (let i = 0; i < btns.length; i++) {
        const btn = btns[i];
        btn.classList.remove('settingsBtnActive', 'settingsBtnInactive');
    }
}

function styleSettingsBtns(key, btn0, btn1) {
    if (settings[key]) {
        btn0.classList.add('settingsBtnInactive');
        btn1.classList.add('settingsBtnActive');
    } else {
        btn1.classList.add('settingsBtnInactive');
        btn0.classList.add('settingsBtnActive');
    }
}

function generateStartscreen() {
    return /* html */ `
        <button class="menuBtn rotateLeft" onclick="start()" onmousedown="playMenuSound()">Start Game</button>
        <button class="menuBtn rotateRight" onmousedown="playMenuSound()">Instructions</button>
        <button class="menuBtn rotateRight" onclick="showSettings()" onmousedown="playMenuSound()">Settings</button>
    `;
}

function generateLoadingscreen() {
    return /* html */ `
        <div id="loadingWrapper">
            <div id="loadingBarBg">
                <div id="loadingBar"></div>
            </div>
        </div>
    `;
}

function generateInstructions() {
    return /* html */ `

    `;
}

function generateMenuSettings() {
    return /* html */ `
        <div class="menuPageWrapper" onmouseup="event.stopPropagation()">
            <button class="close" onclick="returnToMain()">X</button>
            <table class="settings" onclick="updateSettings()">
                <tr>
                    <td><span>Sound</span></td>
                    <td><button id="sound1" onclick="setSound(true)" onmousedown="playMenuSound()">on</button></td>
                    <td><button id="sound0" onclick="setSound(false)" onmousedown="playMenuSound()">off</button></td>
                </tr>
                <tr>
                    <td>
                        <svg width="32" height="24" xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="2" x2="4" y2="18" stroke="white" stroke-width="2"/>
                            <line x1="3" y1="17" x2="30" y2="17" stroke="white" stroke-width="2"/>
                        </svg>                
                        <span>Music</span>
                    </td>
                    <td><button id="music1" onclick="setMusic(true)" onmousedown="playMenuSound()">on</button></td>
                    <td><button id="music0" onclick="setMusic(false)" onmousedown="playMenuSound()">off</button></td>
                </tr>
                <tr>    
                    <td><span>Difficulty</span></td>
                    <td><button id="hardMode0" onclick="setHardMode(false)" onmousedown="playMenuSound()">normal</button></td>
                    <td><button id="hardMode1" onclick="setHardMode(true)" onmousedown="playMenuSound()">hard</button></td>
                </tr>
            </table>
        </div>
    `;
}

function generateIngameSettings() {
    return /* html */ `
        <div class="ingameSettingsWrapper">
            <button onclick="toggleIngameSound()"><img id="ingameSoundBtnImg" src="../img/marks/icons/sound.svg"></button>
            <button onclick="toggleIngameMusic()"><img id="ingameMusicBtnImg" src="../img/marks/icons/music.svg"></button>
        </div>
    `;
}

function renderIngameSettings() {
    const soundImg = document.getElementById('ingameSoundBtnImg');
    const musicImg = document.getElementById('ingameMusicBtnImg');
    if (settings['sound']) {
        soundImg.src = '../img/marks/icons/sound.svg';
        if (settings['music']) {
            musicImg.src = '../img/marks/icons/music.svg';
        } else {
            musicImg.src = '../img/marks/icons/music_disabled.svg';
        }
    } else {
        soundImg.src = '../img/marks/icons/sound_disabled.svg';
        musicImg.src = '../img/marks/icons/music_disabled.svg';
    }
}

function toggleIngameSound() {
    settings['sound'] = !settings['sound'];
    settings['music'] = settings['sound'];
    setIngameMusic();
    renderIngameSettings();
}

function toggleIngameMusic() {
    settings['music'] = !settings['music'];
    setIngameMusic();
    renderIngameSettings();
}