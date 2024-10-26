const battleBackgroundImage = new Image();
battleBackgroundImage.src = 'img/battleBackground.png';

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
});

let draggle
let emby
let renderedSprites
let queue

let battleAnimationId;

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block';
    document.querySelector('#dialogueBox').style.display = 'none';
    document.querySelector('#enemyHP').style.width = '100%';
    document.querySelector('#playerHP').style.width = '100%';
    document.querySelector('#attacksBox').replaceChildren();

    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button');
        button.innerHTML = attack.name;
        document.querySelector('#attacksBox').append(button);
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            emby.attack({ 
                attack: selectedAttack,
                target: draggle,
                renderedSprites
        })
    
        if (draggle.health <= 0) {
            queue.push(() => {
                draggle.faint();
            })
            queue.push(() => {
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId);
                        animate();
                        document.querySelector('#userInterface').style.display = 'none';
                        gsap.to('#overlappingDiv', {
                            opacity: 0
                        })

                        battle.intiated = false;
                    }
    
                })
            })
        }
    
        const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]
    
        queue.push(() => {
            draggle.attack({
                attack: randomAttack,
                target: emby,
                renderedSprites
                })
    
                if (emby.health <= 0) {
                    queue.push(() => {
                        emby.faint();
                    })
                    queue.push(() => {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                document.querySelector('#userInterface').style.display = 'none';
                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                })

                                battle.intiated = false;
                            }
            
                        })
                    })
                }
            })
        })
    
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector('#attackInfo').innerHTML = selectedAttack.type;
            document.querySelector('#attackInfo').style.color = selectedAttack.color;
        })
    
    
    })


}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
        sprite.draw();
    })

}

initBattle();
animateBattle();

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else e.currentTarget.style.display = 'none';
})