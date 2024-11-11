const monsters = {
    Emby: {
        position: {
            x: 310,
            y: 330
        },
        image: {
            src: 'img/embySprite.png'
        },
        frames: {
            max: 4,
            hold: 20
        },
        animate: true,
        name: 'Tangerine',
        attacks: [attacks.Tackle, attacks.FireBall]
    },

    Draggle: {
        position: {
            x: 800,
            y: 100
        },
        image: {
            src: 'img/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 20
        },
        animate: true,
        isEnemy: true,
        name: 'Bin',
        attacks: [attacks.Tackle, attacks.Dance]
    }
}