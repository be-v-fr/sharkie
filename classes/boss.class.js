class Boss extends Movable {
    width = 360;
    height = 480;

    constructor() {
        super().loadImage('../img/enemy/3 Final Enemy/1.Introduce/1.png');
        this.x = 360;
        this.y = 0;
        this.loadImages('introduce', '../img/enemy/3 Final Enemy/1.Introduce/', 10);
        this.loadImages('floating', '../img/enemy/3 Final Enemy/2.floating/', 13);
        this.loadImages('attack', '../img/enemy/3 Final Enemy/Attack/', 6);
        this.loadImages('dead', '../img/enemy/3 Final Enemy/Dead/', 6);
        this.loadImages('hurt', '../img/enemy/3 Final Enemy/Hurt/', 4);
    }


}