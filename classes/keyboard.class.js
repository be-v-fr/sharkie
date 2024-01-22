class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    X = false;
    noControls = false;

    constructor() {
        document.addEventListener('keydown', (ev) => {
            let get = ev.key;
            if (!this.noControls) {
                this.setKey('this.LEFT', 'ArrowLeft', get, true);
                this.setKey('this.RIGHT', 'ArrowRight', get, true);
                this.setKey('this.UP', 'ArrowUp', get, true);
                this.setKey('this.DOWN', 'ArrowDown', get, true);
                this.setKey('this.SPACE', ' ', get, true);
            }
            this.setKey('this.X', 'x', get, true);
        });
        document.addEventListener('keyup', (ev) => {
            let get = ev.key;
            this.setKey('this.LEFT', 'ArrowLeft', get, false);
            this.setKey('this.RIGHT', 'ArrowRight', get, false);
            this.setKey('this.UP', 'ArrowUp', get, false);
            this.setKey('this.DOWN', 'ArrowDown', get, false);
            this.setKey('this.SPACE', ' ', get, false);
            this.setKey('this.X', 'x', get, false);
        });
    }

    setKey(set, key, get, down) {
        if (get == key) {
            eval(`${set} = ${down}`);
        }
    }

    toggleControls(noControls) {
        this.noControls = noControls;
        if (noControls) {
            this.deactivateControls();
        }
    }

    deactivateControls() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
    }
}