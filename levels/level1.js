function generateLevel1() {
    level1 = new Level(
        2,
        [
            // new Pufferfish(-3000, 200),
            // new Jellyfish('lila', -3000, 200),
            new Jellyfish('green', -3000, 200),
            new Boss(600)
        ],
        [
            new Obstacle(1, -3000)
        ],
        [
            new Coin(340, 200),
            new Phial(-3000, 200)
        ]
    );
}