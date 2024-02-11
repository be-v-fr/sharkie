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

function resetMusic() {
    music['main'].pause();
    music['boss'].pause();
    music['main'].currentTime = 0;
    music['boss'].currentTime = 0;
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

function toggleMobile(show) {
    if (window.innerHeight <= 640) {
        const footer = document.getElementById('footer');
        const title = document.getElementById('title');
        if (show) {
            footer.style.display = '';
            title.style.display = '';
        } else {
            footer.style.display = 'none';
            title.style.display = 'none';
        }
    } else {
        footer.style.display = '';
        title.style.display = '';        
    }
}

function displayOnResize() {
    toggleMobile(false);
}

function addMenuListeners() {
    addReturnListener();
    addResizeListener();        
}

function addReturnListener() {
    overlay.addEventListener('mouseup', returnToMain);
}

function addResizeListener() {
    window.addEventListener('resize', displayOnResize);
}

function removeMenuListeners() {
    overlay.removeEventListener('mouseup', returnToMain);    
    window.addEventListener('resize', displayOnResize);
}

function ingameControls(key, down) {
    if(world != null) {
        const btn = getBtnFromKey(key);
        eval(`world.keyboard.${key} = ${down}`);
        if(down) {
            btn.style.opacity = '1';
        } else {
            btn.style.opacity = '';
        }
    }
}

function getBtnFromKey(key) {
    return document.getElementById('ingame' + key);
}