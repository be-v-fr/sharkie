const TOTAL_NR_OF_IMAGES = 100;
let loadingCounter = 0;
let imagePaths = [];
const menuSound = new Audio('./audio/bubble_pop.mp3');
const music = {
    'main': new Audio('../audio/music/main.mp3'),
    'boss': new Audio('../audio/music/boss.mp3')
};

function setMusic() {
    music['main'].loop = true;
    music['main'].volume = 0.14;
    music['boss'].loop = true;
    music['boss'].volume = 0.23;
}

function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}

function playMenuSound() {
    menuSound.currentTime = 0;
    menuSound.play();
}