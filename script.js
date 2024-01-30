const TOTAL_NR_OF_IMAGES = 197;
let loadingCounter = 0;
let imagePaths = [];

function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}