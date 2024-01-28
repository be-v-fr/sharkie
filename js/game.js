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

async function start() {
    overlay.innerHTML = generateLoadingscreen();
    generateLevel1();
    console.log(Date.now());
    world = await new World(canvas, keyboard);
    console.log(Date.now());
    overlay.style.display = 'none';
}

function generateStartscreen() {
    return /* html */ `
        <button class="menuBtn" onclick="start()">Start Game</button>
        <button class="menuBtn">Instructions</button>
        <button class="menuBtn">Settings</button>
    `;
}

function generateLoadingscreen() {
    return /* html */ `
        <div id="loadingBarBg">
            <div id="loadingBar"></div>
        </div>
        <span>loading... </span><span id="loadingObj"</span>
    `;
}