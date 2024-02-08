function generateLevel1() {
    level1 = new Level(
        3,
        [
            new Jellyfish('lila', 620, 100),
            new Jellyfish('lila', 750, 230),
            new Pufferfish(1100, 320),
            new Pufferfish(1200, 120),
            new Pufferfish(1400, 220),
            new Jellyfish('green', 1630, 60),
            new Pufferfish(2200, 340),
            new Jellyfish('lila', 2020, 280),
            new Pufferfish(2400, 200),
            new Jellyfish('lila', 2260, 260),
            new Jellyfish('green', 2520, 250),
            new Boss(3200)
        ],
        [
            new Obstacle(2, 400),
            new Obstacle(3, 1600),
            new Obstacle(1, 2000)
        ],
        [
            new Coin(350, 150),
            new Coin(450, 210),
            new Coin(550, 270),
            new Phial(900, 380),
            new Coin(1340, 40),            
            new Coin(1440, 40),
            new Phial(1540, 390),
            new Coin(1740, 20),
            new Coin(1740, 360),
            new Coin(1820, 45),
            new Coin(1820, 335),
            new Coin(1875, 110),
            new Coin(1875, 270),
            new Coin(1896, 190),
            new Phial(2100, 312),
            new Phial(2740, 380),
            new Coin(2600, 170),
            new Coin(2670, 150),
            new Phial(3420, 380)
        ]
    );
}