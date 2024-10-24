const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = 'img/Pellet Town.png';

const playerImage = new Image();
playerImage.src = 'img/playerDown.png';

class Sprite {
    constructor({position, velocity, image})
    {
        this.position = position;
        this.velocity = velocity;
        this.image = image;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position: {
        x: -740, 
        y: -600
    }, 
    image: image
});

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw(ctx);
  ctx.drawImage(
    playerImage,
    0,
    0,
    playerImage.width/4,
    playerImage.height, 
    canvas.width/2 - playerImage.width/8, 
    canvas.height/2 - playerImage.height/2,
    playerImage.width/4,
    playerImage.height
    );

    if (keys.w && lastKey === 'w') background.position.y += 3;
    if (keys.s && lastKey === 's') background.position.y -= 3;
    if (keys.a && lastKey === 'a') background.position.x += 3;
    if (keys.d && lastKey === 'd') background.position.x -= 3;

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

