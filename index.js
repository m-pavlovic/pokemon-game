const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, i+70));
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70) {
    battleZonesMap.push(battleZonesData.slice(i, i+70));
}

const boundaries = [];
const offset = {
    x: -740,
    y: -610
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
            }
        })
        )
    })
})

const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        battleZones.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
            }
        })
        )
    })
})

const image = new Image();
image.src = 'img/Pellet Town.png';

const foregroundImage = new Image();
foregroundImage.src = 'img/foregroundObjects.png';

const playerDown = new Image();
playerDown.src = 'img/playerDown.png';

const playerUp = new Image();
playerUp.src = 'img/playerUp.png';

const playerLeft = new Image();
playerLeft.src = 'img/playerLeft.png';

const playerRight = new Image();
playerRight.src = 'img/playerRight.png';

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDown,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUp,
        down: playerDown,
        left: playerLeft,
        right: playerRight
    }
});

const background = new Sprite({
    position: {
        x: offset.x, 
        y: offset.y
    }, 
    image: image
});

const foreground = new Sprite({
    position: {
        x: offset.x, 
        y: offset.y
    }, 
    image: foregroundImage
});

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
}

const movables = [background, ...boundaries, foreground, ...battleZones];

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}
function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
        boundary.draw();
  })
    battleZones.forEach((battleZone) => {
        battleZone.draw();
    })
    player.draw();
    foreground.draw();

    if (keys.w || keys.a || keys.s || keys.d) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                })
            ) {
                break;
            }
        }
    }
    
    let moving = true;
    player.moving = false;
    if (keys.w && lastKey === 'w') {
        player.moving = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3;
            })
        }
    } else if (keys.s && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3;
            })
        }
    } else if (keys.a && lastKey === 'a') {
        player.moving = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3;
            })
        }
    } else if (keys.d && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3;
            })
        }
    }

}

animate();

let lastKey = '';
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w = true;
            lastKey = 'w';
            break;
        case 's':
            keys.s = true;
            lastKey = 's';
            break;
        case 'a':
            keys.a = true;
            lastKey = 'a';
            break;
        case 'd':
            keys.d = true;
            lastKey = 'd';
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w = false;
            break;
        case 's':
            keys.s = false;
            break;
        case 'a':
            keys.a = false;
            break;
        case 'd':
            keys.d = false;
            break;
    }
});

