function generateLevel1() {
    level1 = new Level(
        2,
        [
            new Pufferfish(),
            new Jellyfish('lila'),
            // new Jellyfish('green'),
            // new Jellyfish('green'),
            new Boss()
        ],
        [
            new Obstacle(1, 750)
        ],
        [
            // new Coin(140, 200),
            new Coin(340, 200),
            new Coin(540, 200),
            // new Coin(740, 200),
            new Phial(100, 200)
        ]
    );
}