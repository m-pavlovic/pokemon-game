const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, i+70));
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

const image = new Image();
image.src = 'img/Pellet Town.png';

const foregroundImage = new Image();
foregroundImage.src = 'img/foregroundObjects.png';

const playerImage = new Image();
playerImage.src = 'img/playerDown.png';

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
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

const movables = [background, ...boundaries, foreground];

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
    player.draw();
    foreground.draw();
    
    let moving = true;
    if (keys.w && lastKey === 'w') {
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
                console.log('collision');
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
                console.log('collision');
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
                console.log('collision');
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
                console.log('collision');
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
            playerImage.src = 'img/playerUp.png';
            break;
        case 's':
            keys.s = true;
            lastKey = 's';
            playerImage.src = 'img/playerDown.png';
            break;
        case 'a':
            keys.a = true;
            lastKey = 'a';
            playerImage.src = 'img/playerLeft.png';
            break;
        case 'd':
            keys.d = true;
            lastKey = 'd';
            playerImage.src = 'img/playerRight.png';
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w = false;
            playerImage.src = 'img/playerUp.png';
            break;
        case 's':
            keys.s = false;
            playerImage.src = 'img/playerDown.png';
            break;
        case 'a':
            keys.a = false;
            playerImage.src = 'img/playerLeft.png';
            break;
        case 'd':
            keys.d = false;
            playerImage.src = 'img/playerRight.png';
            break;
    }
});

