/**
 * generate startscreen/main menu
 * @returns {String} HTML string
 */
function generateStartscreen() {
    return /* html */ `
        <button class="menuBtn rotateLeft" onclick="start()" onmousedown="playMenuSound()">Start Game</button>
        <button class="menuBtn rotateRight" onclick="showInstructions()" onmousedown="playMenuSound()">Instructions</button>
        <button class="menuBtn rotateRight" onclick="showSettings()" onmousedown="playMenuSound()">Settings</button>
    `;
}


/**
 * generate loading screen menu subpage
 * @returns {String} HTML string
 */
function generateLoadingscreen() {
    return /* html */ `
        <div id="loadingWrapper">
            <div id="loadingBarBg">
                <div id="loadingBar" style="width: 0"></div>
            </div>
        </div>
    `;
}


/**
 * generate instructions menu subpage
 * @returns {String} HTML string
 */
function generateInstructions() {
    return /* html */ `
        <div class="menuPageWrapper" onmouseup="event.stopPropagation()">
            <button class="close" onclick="returnToMain()">X</button>
            <div class="instructions">
                <table class="instructionsMain">
                    <tr>
                        <td>
                            <img id="instrArrowKeys" src="./img/buttons/key/arrow.png">
                        </td>
                        <td>
                            <div class="tdContainer">    
                                Move
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img id="instrSpaceKey" class="instrSpaceKey" src="./img/buttons/key/space.png">
                        </td>
                        <td>
                            <div class="tdContainer">    
                                Bubble Attack / Fin Slap
                            </div>
                        </td>
                    </tr>
                </table>
                <table class="attacks">
                    <tr>
                        <td>${listMark}</td>
                        <td>
                            <div class="tdContainer instructionsSlap">
                                <p>When facing a near opponent, Sharkie will execute a slap. Do not touch electric jellyfish!</p>
                                <img id="jellyfishWarning" src="./img/marks/warning.png">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>${listMark}</td>
                        <td>
                            <div class="tdContainer">
                                <img class="toxicBubbleKeys" src="./img/buttons/key/x.png"> + 
                                <img class="toxicBubbleKeys instrSpaceKey" src="./img/buttons/key/space.png">
                                Toxic Bubble
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    `;
}


/**
 * generate settings menu subpage
 * @returns {String} HTML string
 */
function generateMenuSettings() {
    return /* html */ `
        <div class="menuPageWrapper" onmouseup="event.stopPropagation()">
            <button class="close" onclick="returnToMain()">X</button>
            <table class="settings" onclick="updateSettings(false)">
                <tr>
                    <td><span>Sound</span></td>
                    <td><button id="sound1" onclick="setSound(true)" onmousedown="playMenuSound()">on</button></td>
                    <td><button id="sound0" onclick="setSound(false)" onmousedown="playMenuSound()">off</button></td>
                </tr>
                <tr>
                    <td>
                        ${listMark}         
                        <span>Music</span>
                    </td>
                    <td><button id="music1" onclick="setMenuMusic(true)" onmousedown="playMenuSound()">on</button></td>
                    <td><button id="music0" onclick="setMenuMusic(false)" onmousedown="playMenuSound()">off</button></td>
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


/**
 * generate ingame game controls
 * @returns {String} HTML string
 */
function generateIngameControls() {
    return /* html */ `
        <div class="ingameInterface">
            <div id="ingameSettingsWrapper">
                <button id="ingameSoundBtn" onclick="toggleIngameSound()"><img id="ingameSoundBtnImg" src="./img/marks/icons/sound.svg"></button>
                <button id="ingameMusicBtn" onclick="toggleIngameMusic()"><img id="ingameMusicBtnImg" src="./img/marks/icons/music.svg"></button>
            </div>
            <div class="ingameControlsWrapper">
                <div class="keyRow">
                    <div>
                        <button id="ingameLEFT" ${generateControlListeners('LEFT')}>
                            <img src="./img/buttons/key/up.png">
                        </button>
                        <button id="ingameRIGHT" ${generateControlListeners('RIGHT')}>
                            <img src="./img/buttons/key/up.png">
                        </button>
                    </div>
                    <div>
                        <button id="ingameDOWN" ${generateControlListeners('DOWN')}>
                            <img src="./img/buttons/key/up.png">
                        </button>
                        <button id="ingameUP" ${generateControlListeners('UP')}>
                            <img src="./img/buttons/key/up.png">
                        </button>
                    </div>
                </div>
                <div class="keyRow xAndSpaceRow">
                    <button id="ingameX" ${generateControlListeners('X')}>
                        <img src="./img/buttons/key/x.png">
                    </button>
                    <button id="ingameSPACE" ${generateControlListeners('SPACE')}>
                        <img src="./img/buttons/key/attack.png">
                    </button>
                </div>
            </div>
        </div>
    `;
}


/**
 * attach event listeners to an ingame control button
 * @param {String} key - name of button/key
 * @returns {String} HTML string
 */
function generateControlListeners(key) {
    return `onmousedown=${generateListenerAction(key, true)} ontouchstart=${generateListenerAction(key, true)} 
    onmouseup=${generateListenerAction(key, false)} ontouchend=${generateListenerAction(key, false)}`;
}


/**
 * generate action triggered by an event listener attached to an ingame control button
 * @param {String} key - name of button/key
 * @param {Boolean} down - key status (true = key pressed, false = key not pressed)
 * @returns {String} HTML string
 */
function generateListenerAction(key, down) {
    return `"ingameControls('${key}', ${down}); event.preventDefault(); event.stopPropagation()"`;
}


/**
 * generate endscreen
 * @param {string} message - endscreen message
 * @returns {String} HTML string
 */
function generateEndscreen(message) {
    return /* html */ `
        <div id="endscreen">
            <p class="endscreenMsg">${message}</p>
        </div>
    `;
}