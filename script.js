const TOTAL_NR_OF_IMAGES = 100;
let loadingCounter = 0;
let imagePaths = [];
const menuSound = new Audio('./audio/bubble_pop.mp3');
const music = {
    'main': new Audio('../audio/music/main.mp3'),
    'boss': new Audio('../audio/music/boss.mp3')
};

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