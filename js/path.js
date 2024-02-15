function initAnimationPaths() {
    animations = {
        'Boss': [
            ['introduce', './img/enemy/boss/introduce/', 10],
            ['floating', './img/enemy/boss/floating/', 13],
            ['attack', './img/enemy/boss/attack/', 6],
            ['die', './img/enemy/boss/dead/', 6],
            ['hurt', './img/enemy/boss/hurt/', 4]
        ],

        'Bubble': [
            ['green jellyfish', './img/enemy/jellyfish/green/dead/', 4],
            ['lila jellyfish', './img/enemy/jellyfish/lila/dead/', 4]
        ],

        'Coin': [
            ['normal', './img/marks/coin/', 4]
        ],

        'Character': [
            ['idle', './img/sharkie/idle/', 18],
            ['rest', './img/sharkie/sleep/', 14],
            ['swim', './img/sharkie/swim/', 6],
            ['bubble normal', './img/sharkie/attack/normal_bubble/', 8],
            ['bubble toxic', './img/sharkie/attack/toxic_bubble/', 8],
            ['no toxic', './img/sharkie/attack/toxic_bubble/empty/', 8],
            ['slap', './img/sharkie/attack/fin_slap/', 8],
            ['hurt', './img/sharkie/hurt/normal/', 5],
            ['shocked', './img/sharkie/hurt/shocked/', 3],
            ['die normal', './img/sharkie/dead/normal/', 12],
            ['die shocked', './img/sharkie/dead/shocked/', 10]
        ],

        'Jellyfish': [
            ['normal green', './img/enemy/jellyfish/green/', 4],
            ['normal lila', './img/enemy/jellyfish/lila/', 4],
        ],

        'Phial': [
            ['bubbling', './img/marks/poison/', 8]
        ],

        'Pufferfish': [
            ['normal', './img/enemy/pufferfish/swim/', 5],
            ['transition', './img/enemy/pufferfish/transition/', 5],
            ['blown', './img/enemy/pufferfish/blown/', 5],
            ['die', './img/enemy/pufferfish/die/', 3]
        ]
    };
}

function initSoundsPaths() {
    sounds = {
        'Boss': {
            'introduce': new Audio('./audio/boss_splash.mp3'),
            'attack': new Audio('./audio/boss_bite.mp3'),
            'hurt': new Audio('./audio/boss_hurt.mp3'),
            'die': new Audio('./audio/boss_die.mp3')
        },

        'Bubble': {
            'blow': new Audio('./audio/bubble.mp3'),
            'pop': new Audio('./audio/bubble_pop.mp3'),
        },

        'Coin': {
            'collect': new Audio('./audio/coin.mp3')
        },

        'Character': {
            'swimming': new Audio('./audio/sharkie_swim.mp3'),
            'swim up': new Audio('./audio/sharkie_swim_up.mp3'),
            'swim down': new Audio('./audio/sharkie_swim_down.mp3'),
            'hurt': new Audio('./audio/sharkie_hurt.mp3'),
            'shocked': new Audio('./audio/sharkie_shocked.mp3'),
            'die': new Audio('./audio/sharkie_die.mp3'),
            'die shocked': new Audio('./audio/sharkie_die_shocked.mp3'),
            'snoring': new Audio('./audio/sharkie_long_idle.mp3'),
            'slap': new Audio('./audio/sharkie_slap.mp3')
        },

        'Phial': {
            'collect': new Audio('./audio/collect.mp3')
        },

        'Pufferfish': {
            'die': new Audio('./audio/pufferfish_die.mp3')
        }
    };
}