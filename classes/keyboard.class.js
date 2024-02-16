class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    X = false;
    noControls = false;

    /**
     * constructor
     */
    constructor() {
        this.addKeyDownListener();
        this.addKeyUpListener();
    }


    /**
     * add listener for keydown event
     */
    addKeyDownListener() {
        document.addEventListener('keydown', (ev) => {
            let get = ev.key;
            if (!this.noControls) {
                this.setKey('this.LEFT', 'ArrowLeft', get, true);
                this.setKey('this.RIGHT', 'ArrowRight', get, true);
                this.setKey('this.UP', 'ArrowUp', get, true);
                this.setKey('this.DOWN', 'ArrowDown', get, true);
                this.setKey('this.SPACE', ' ', get, true);
                this.setKey('this.X', 'x', get, true);
            }
        });
    }


    /**
     * add listener for keyup event
     */
    addKeyUpListener() {
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


    /**
     * set selected key attribute of this keyboard object
     * @param {String} set - key attribute (in this keyboard object) as string 
     * @param {String} key - key name from event 
     * @param {String} get - name of pressed key from event
     * @param {Boolean} down - true = keydown, false = keyup 
     */
    setKey(set, key, get, down) {
        if (get == key) {
            eval(`${set} = ${down}`);
        }
    }


    /**
     * toggle game controls
     * @param {Boolean} noControls - true = deactivated 
     */
    toggleControls(noControls) {
        this.noControls = noControls;
        if (noControls) {
            this.deactivateControls();
        }
    }


    /**
     * set all key attributes to false
     */
    deactivateControls() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
    }


    /**
     * request if no game control keys are pressed
     * @returns {Boolean} - is no key pressed?
     */
    noKey() {
        return !this.RIGHT && !this.LEFT && !this.UP && !this.DOWN && !this.SPACE;
    }


    /**
     * make character act by playing via keyboard
     */
    play() {
        this.playLeftRight();
        this.playUpDown();
        this.playOther();
        this.playNone();
    }


    /**
     * actions associated with left and right arrow keys
     */
    playLeftRight() {
        if (this.RIGHT && !this.LEFT && world.character.state != 'swim blocked right') {
            world.character.actLeft();
        } else if (this.LEFT && !this.RIGHT && world.character.state != 'swim blocked left') {
            world.character.actRight();
        }
    }


    /**
     * actions associated with up and down arrow keys
     */
    playUpDown() {
        if (this.UP) {
            world.character.swimY(true);
        } else if (this.DOWN) {
            world.character.swimY(false);
        }
    }


    /**
     * actions not associated with a specific direction
     * (includes especially space key actions)
     */
    playOther() {
        if (this.SPACE && Date.now() - world.character.lastBubble > 750 && !world.character.state.includes('attacking')) {
            world.character.state = world.character.state + 'attacking';
            if (this.X) {
                world.character.bubble(true);
            } else {
                world.character.selectAttack();
            }
        }
    }


    /**
     * actions when no key is pressed at all
     */
    playNone() {
        if (world.character.state != 'rest' && world.character.state != 'hit' && world.character.state != 'dead') {
            if (this.noKey() && world.character.state != 'idle') {
                world.character.idle();
            } else if (Date.now() - world.character.idleSince > 4000) {
                world.character.rest();
            }
        }
    }
}