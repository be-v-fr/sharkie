const TOTAL_NR_OF_IMAGES = 207;
let loadingCounter = 0;
let animations = {};
let sounds = {}
let imagePaths = [];
const menuSound = new Audio('./audio/bubble_pop.mp3');
let music = {};
const listMark = /* html */ `
                        <svg width="32" height="24" xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="2" x2="4" y2="18" stroke="white" stroke-width="2"/>
                            <line x1="3" y1="17" x2="30" y2="17" stroke="white" stroke-width="2"/>
                        </svg>
`;

/**
 * save JSON array to local storage
 * @param {String} key - key for local storage 
 * @param {JSON} array - JSON array 
 */
function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}


/**
 * load JSON array from local storage
 * @param {String} key - key from local storage 
 * @param {JSON} array - JSON array 
 */
function getArray(key) {
    return JSON.parse(localStorage.getItem(key));
}


/**
 * load game settings
 */
function loadSettings() {
    if (getArray('settings')) {
        settings = getArray('settings');
    }
}


/**
 * save game settings
 */
function saveSettings() {
    setArray('settings', settings);
}


/**
 * initialize music, including music settings
 */
function initMusic() {
    music = {
        'main': new Audio('./audio/music/main.mp3'),
        'boss': new Audio('./audio/music/boss.mp3')
    };
    music['main'].loop = true;
    music['boss'].loop = true;
    setMusic(settings['music']);
}


/**
 * reset music tracks to state directly after initialization
 */
function resetMusic() {
    music['main'].pause();
    music['boss'].pause();
    music['main'].currentTime = 0;
    music['boss'].currentTime = 0;
}


/**
 * delete entry from array by entry index
 * @param {Number} index - entry index/position in array 
 * @param {Array} array - requested array
 * @returns {Array} updated shorter array
 */
function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}


/**
 * play menu sound
 */
function playMenuSound() {
    if (settings['sound']) {
        menuSound.currentTime = 0;
        menuSound.play();
    }
}


/**
 * Ergänzung zu CSS-Media-Queries
 * @param {Boolean} show - true = Elemente werden angezeigt, false = Elemente werden verborgen 
 */
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

/**
 * this function is called on certain menu subpages
 * to prevent elements which are usually hidden in mobile view from being shown nonetheless
 * by scaling down the viewport from PC size to mobile size 
 */
function displayOnResize() {
    toggleMobile(false);
}


/**
 * add event listeners for menu subpage
 */
function addMenuListeners() {
    addReturnListener();
    addResizeListener();
}


/**
 * add event listener for returning from menu subpage to main page
 */
function addReturnListener() {
    overlay.addEventListener('mouseup', returnToMain);
}


/**
 * add resize event listener for menu subpage
 */
function addResizeListener() {
    window.addEventListener('resize', displayOnResize);
}


/**
 * remove menu subpage event listeners
 */
function removeMenuListeners() {
    overlay.removeEventListener('mouseup', returnToMain);
    window.removeEventListener('resize', displayOnResize);
}


/**
 * set style for pressing keys via ingame touchscreen controls
 * @param {String} key - key/button
 * @param {Boolean} down - true = key active, false = key inactive 
 */
function ingameControls(key, down) {
    if (world != null) {
        const btn = getBtnFromKey(key);
        eval(`world.keyboard.${key} = ${down}`);
        if (down == true) {
            btn.style.opacity = '0.94';
        } else {
            btn.style.opacity = '0.68';
        }
    }
}


/**
 * select button element according to key
 * @param {String} key - key
 * @returns {Element} button
 */
function getBtnFromKey(key) {
    return document.getElementById('ingame' + key);
}