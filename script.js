const TOTAL_NR_OF_IMAGES = 211;
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
 * JSON-Array im Local Storage speichern
 * @param {String} key - Key für Local Storafge 
 * @param {JSON} array - JSON-Array 
 */
function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}


/**
 * JSON-Array aus Local Storage lesen
 * @param {String} key - Key für Local Storage 
 * @returns {JSON} JSON-Array
 */
function getArray(key) {
    return JSON.parse(localStorage.getItem(key));
}


/**
 * Einstellungen laden
 */
function loadSettings() {
    if (getArray('settings')) {
        settings = getArray('settings');
    }
}


/**
 * Einstellungen speichern
 */
function saveSettings() {
    setArray('settings', settings);
}


/**
 * Musik initialisieren
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
 * Musik-Tracks zurücksetzen
 */
function resetMusic() {
    music['main'].pause();
    music['boss'].pause();
    music['main'].currentTime = 0;
    music['boss'].currentTime = 0;
}


/**
 * Eintrag aus Array löschen
 * @param {Number} index - Position im Array 
 * @param {Array} array - betroffener Array 
 * @returns {Array} aktualisierter Array
 */
function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}


/**
 * Menü-Sound abspielen
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
 * diese Funktion wird auf bestimmten Menüseiten aufgerufen, um zu verhindern, dass Elemente,
 * die in der Mobilanzeige normalerweise verborgen werden, dort durch Verkleinerung der Viewport-
 * größe dennoch angezeigt werden könnten
 */
function displayOnResize() {
    toggleMobile(false);
}


/**
 * Event-Listener für Menü hinzufügen
 */
function addMenuListeners() {
    addReturnListener();
    addResizeListener();
}


/**
 * Listener für Rückkehr zum Hauptmenü hinzufügen
 */
function addReturnListener() {
    overlay.addEventListener('mouseup', returnToMain);
}


/**
 * Listener für Änderung der Viewport-Größe hinzufügen
 */
function addResizeListener() {
    window.addEventListener('resize', displayOnResize);
}


/**
 * Event-Listener für Menü entfernen
 */
function removeMenuListeners() {
    overlay.removeEventListener('mouseup', returnToMain);
    window.addEventListener('resize', displayOnResize);
}


/**
 * Style für Tastendruck bei Touchscreen-Steuerung
 * @param {String} key - Taste/Button 
 * @param {Boolean} down - true = key aktiv, false = key nicht aktiv 
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
 * Button-Element anhand von Taste selektieren 
 * @param {String} key - Taste 
 * @returns {Element} Button
 */
function getBtnFromKey(key) {
    return document.getElementById('ingame' + key);
}