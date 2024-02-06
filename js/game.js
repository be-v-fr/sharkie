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
            overlay.style.display = 'none';
        }
    }, 10);
}

function preload() {
    let bubble = new Bubble(0, 0, false, 0);
    bubble = new Bubble(0, 0, true, 0);
}

function loadingProgress() {
    return 100 * loadingCounter / TOTAL_NR_OF_IMAGES;
}

function isLoaded() {
    return loadingCounter >= TOTAL_NR_OF_IMAGES;
}

function showSettings() {
    overlay.innerHTML = generateSettings();
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

function generateSettings() {
    return /* html */ `
        <div class="menuPageWrapper" onmouseup="event.stopPropagation()">
            <button class="close" onclick="returnToMain()">X</button>
            <table class="settings" onclick="renderSettings()">
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
                    <td><button id="hardMode1" onclick="setHardMode(true)" onmousedown="playMenuSound()">normal</button></td>
                    <td><button id="hardMode0" onclick="setHardMode(false)" onmousedown="playMenuSound()">hard</button></td>
                </tr>
            </table>
        </div>
    `;
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