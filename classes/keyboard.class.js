class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    X = false;
    noControls = false;

    /**
     * Konstruktor
     */
    constructor() {
        this.addKeyDownListener();
        this.addKeyUpListener();
    }


    /**
     * Listener mit Funktion für keydown-Event
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
     * Listener mit Funktion für keyup-Event
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
     * Key-Attribut der Keyboard-Klasse festlegen
     * @param {String} set - Key-Klassenattribut als String 
     * @param {String} key - Event-Key-Name als String 
     * @param {String} get - Name der gedrückten Taste 
     * @param {Boolean} down - true = keydown, false = keyup 
     */
    setKey(set, key, get, down) {
        if (get == key) {
            eval(`${set} = ${down}`);
        }
    }


    /**
     * Steuerung deaktivieren
     * @param {Boolean} noControls - true = deaktiviert 
     */
    toggleControls(noControls) {
        this.noControls = noControls;
        if (noControls) {
            this.deactivateControls();
        }
    }


    /**
     * alle Tasten auf false setzen
     */
    deactivateControls() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
    }


    /**
     * Abfrage, ob keine Taste gedrückt wird
     * @returns {Boolean} - keine Taste gedrückt?
     */
    noKey() {
        return !this.RIGHT && !this.LEFT && !this.UP && !this.DOWN && !this.SPACE;
    }


    /**
     * Character spielen
     */
    play() {
        this.playLeftRight();
        this.playUpDown();
        this.playOther();
        this.playNone();
    }


    /**
     * Handlungen links und rechts
     */
    playLeftRight() {
        if (this.RIGHT && !this.LEFT && world.character.state != 'swim blocked right') {
            world.character.actLeft();
        } else if (this.LEFT && !this.RIGHT && world.character.state != 'swim blocked left') {
            world.character.actRight();
        }
    }


    /**
     * Handlungen oben und unten
     */
    playUpDown() {
        if (this.UP) {
            world.character.swimY(true);
        } else if (this.DOWN) {
            world.character.swimY(false);
        }
    }


    /**
     * Handlungen ohne bestimmte Richtung
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
     * Handlungen ohne Tastendruck
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