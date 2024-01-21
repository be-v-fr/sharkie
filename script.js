function removeAt(index, array) {
    return array.filter((elmnt) => {
        return array.indexOf(elmnt) !== index;
    });
}