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
}