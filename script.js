const TOTAL_NR_OF_IMAGES = 211;
let loadingCounter = 0;
let imagePaths = [];
const menuSound = new Audio('./audio/bubble_pop.mp3');
const music = {
    'main': new Audio('../audio/music/main.mp3'),
    'boss': new Audio('../audio/music/boss.mp3')
};

function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

function getArray(key) {
    return JSON.parse(localStorage.getItem(key));
}

function loadSettings() {
    if (getArray('settings')) {
        settings = getArray('settings');
    }
}

function saveSettings() {
    setArray('settings', settings);
}

function initMusic() {
    music['main'].loop = true;
    music['boss'].loop = true;
    setMusic(true);
}

function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}

function playMenuSound() {
    if (settings['sound']) {
        menuSound.currentTime = 0;
        menuSound.play();
    }
}