const TOTAL_NR_OF_IMAGES = 100;
let loadingCounter = 0;
let imagePaths = [];
let menuSound = new Audio('./audio/bubble_pop.mp3');

function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}

function playMenuSound() {
    menuSound.currentTime = 0;
    menuSound.play();
}