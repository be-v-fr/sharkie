let canvas;
let overlay;
let keyboard = new Keyboard();
let level1;
let world;

function init() {
    canvas = document.getElementById('canvas');
    overlay = document.getElementById('overlay');
    overlay.innerHTML = generateStartscreen();
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

function generateStartscreen() {
    return /* html */ `
        <button class="menuBtn rotateLeft" onclick="start()" onmousedown="playMenuSound()">Start Game</button>
        <button class="menuBtn rotateRight" onmousedown="playMenuSound()">Instructions</button>
        <button class="menuBtn rotateRight" onmousedown="playMenuSound()">Settings</button>
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