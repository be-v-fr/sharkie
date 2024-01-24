const level1 = new Level(
    2,
    [
        new Pufferfish(),
        new Jellyfish('lila'),
        new Jellyfish('green'),
        new Jellyfish('lila'),
        new Boss()
    ],
    [   new Obstacle(1, 60)
    ]
);