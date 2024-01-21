let canvas;
let keyboard = new Keyboard();
let world;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}