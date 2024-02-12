const ANIMATIONS = {
    'Boss': [
        ['introduce', '../img/enemy/3 Final Enemy/1.Introduce/', 10],
        ['floating', '../img/enemy/3 Final Enemy/2.Floating/', 13],
        ['attack', '../img/enemy/3 Final Enemy/Attack/', 6],
        ['die', '../img/enemy/3 Final Enemy/Dead/', 6],
        ['hurt', '../img/enemy/3 Final Enemy/Hurt/', 4]
    ],

    'Bubble': [
        ['green jellyfish', '../img/enemy/2.Jellyfish/Dead/green/', 4],
        ['lila jellyfish', '../img/enemy/2.Jellyfish/Dead/lila/', 4]
    ],

    'Character': [
        ['idle', '../img/sharkie/1.IDLE/', 18],
        ['rest', '../img/sharkie/2.LONG_IDLE/I', 14],
        ['swim', '../img/sharkie/3.SWIM/', 6],
        ['bubble normal', '../img/sharkie/4.Attack/normal_bubble/', 8],
        ['bubble toxic', '../img/sharkie/4.Attack/toxic_bubble/', 8],
        ['no toxic', '../img/sharkie/4.Attack/toxic_bubble/empty/', 8],
        ['slap', '../img/sharkie/4.Attack/Fin slap/', 8],
        ['hurt', '../img/sharkie/5.Hurt/1.Poisoned/', 5],
        ['shocked', '../img/sharkie/5.Hurt/2.Shocked/', 3],
        ['die normal', '../img/sharkie/6.Dead/1.Poisoned/', 12],
        ['die shocked', '../img/sharkie/6.Dead/2.Shocked/', 10]
    ],

    'Jellyfish': [
        ['normal green', '../img/enemy/2.Jellyfish/green/', 4],
        ['normal lila', '../img/enemy/2.Jellyfish/lila/', 4],
    ],

    'Phial': [
        ['bubbling', './img/marks/2.Poison/animated/', 8]
    ],

    'Pufferfish': [
        ['normal', '../img/enemy/1.Pufferfish/1.Swim/', 5],
        ['transition', '../img/enemy/1.Pufferfish/2.Transition/', 5],
        ['blown', '../img/enemy/1.Pufferfish/3.Bubbleswim/', 5],
        ['die', '../img/enemy/1.Pufferfish/4.Die/', 3]
    ]
};

const SOUNDS = {
    'Boss': {
        'intro': new Audio('../audio/boss_splash.mp3'),
        'attack': new Audio('../audio/boss_bite.mp3'),
        'hurt': new Audio('../audio/boss_hurt.mp3'),
        'die': new Audio('../audio/boss_die.mp3')
    },

    'Bubble': {
        'blow': new Audio('../audio/bubble.mp3'),
        'pop': new Audio('../audio/bubble_pop.mp3'),
    },

    'Coin': {
        'collect': new Audio('../audio/coin.mp3')
    },

    'Character': {
        'swimming': new Audio('../audio/sharkie_swim.mp3'),
        'swim up': new Audio('../audio/sharkie_swim_up.mp3'),
        'swim down': new Audio('../audio/sharkie_swim_down.mp3'),
        'hurt': new Audio('../audio/sharkie_hurt.mp3'),
        'shocked': new Audio('../audio/sharkie_shocked.mp3'),
        'die': new Audio('../audio/sharkie_die.mp3'),
        'die shocked': new Audio('../audio/sharkie_die_shocked.mp3'),
        'snoring': new Audio('../audio/sharkie_long_idle.mp3'),
        'slap': new Audio('../audio/sharkie_slap.mp3')
    },

    'Phial': {
        'collect': new Audio('../audio/collect.mp3')
    },

    'Pufferfish': {
        'die': new Audio('../audio/pufferfish_die.mp3')
    }
};