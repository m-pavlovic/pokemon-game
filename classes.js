class Sprite {
    constructor({position, image, frames = {max: 1, hold: 10}, 
        sprites, animate = false, rotation = 0})
    {
        this.position = position;
        this.image = new Image();
        this.frames = {...frames, value: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
        this.image.src = image.src;
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation
    }
    draw() {
        ctx.save();
        ctx.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x - this.width/2, -this.position.y - this.height/2);
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.image,
            this.frames.value * this.image.width / this.frames.max,
            0,
            this.image.width/ this.frames.max,
            this.image.height, 
            this.position.x,
            this.position.y,
            this.image.width/ this.frames.max,
            this.image.height
            )

        ctx.restore();
        
        if (!this.animate) return;

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.value < this.frames.max - 1) this.frames.value++;
            else this.frames.value = 0;  
        }
    }

}

class Monster extends Sprite {
    constructor({
        isEnemy = false,
        name,
        attacks,
    }) {
        super(...arguments);
        this.health = 100;
        this.isEnemy = isEnemy;
        this.name = name;
        this.attacks = attacks;
    }

    faint() {
        if (this.isEnemy) {
            document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!';
            gsap.to(this.position, {
                y: this.position.y + 20,

            })
            gsap.to(this, {
                opacity: 0,
            })

            audio.Victory.play();
        }

        this.opacity = 0.5;
        this.animate = false;
    }

    attack({attack, target, renderedSprites}) {
        
        document.querySelector('#dialogueBox').style.display = 'block';
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name + '!';

        target.health -= attack.damage;

        let healthBar = '#enemyHP';
        if (this.isEnemy) healthBar = '#playerHP';

        let rotation = 1;
        if (this.isEnemy) rotation = -2.2;


        switch(attack.name) {
            case 'Tackle':
                
                const timeLine = gsap.timeline();

                let movementDistance = 20;
                if (this.isEnemy) movementDistance = -20;

                timeLine.to(this.position, {
                    x: this.position.x - movementDistance,
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {

                        audio.TackleHit.play();

                        gsap.to(healthBar, {
                            width: target.health + '%',
                        })

                        gsap.to(target.position, {
                            x: target.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(target, {
                            opacity: 0.5,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                    }
                }).to(this.position, {
                    x: this.position.x
                });
                
                break;

            case 'FireBall':
                audio.InitFireball.play();
                const fireBallImage = new Image();
                fireBallImage.src = 'img/fireball.png';
                const fireBall = new Sprite({
                    position: {x: this.position.x, y: this.position.y},
                    image: fireBallImage,
                    frames: {max: 4, hold: 10},
                    animate: true,
                    rotation
                });

                renderedSprites.splice(1, 0, fireBall);


                gsap.to(fireBall.position, {
                    x: target.position.x,
                    y: target.position.y,
                    duration: 1,
                    onComplete: () => {
                        audio.FireballHit.play();
                        fireBall.animate = false;
                        fireBall.opacity = 0;

                        gsap.to(healthBar, {
                            width: target.health + '%',
                        })

                        gsap.to(target.position, {
                            x: target.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(target, {
                            opacity: 0.5,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        renderedSprites.splice(1, 1);
                    }
                });

            break;

            case 'Dance':
                const attacker = this;

                const danceTimeline = gsap.timeline();

                danceTimeline.to(attacker.position, {
                    x: attacker.position.x + 40,
                    y: attacker.position.y + 20,
                    rotation: 0.5,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                }).to(attacker.position, {
                    x: attacker.position.x - 40,
                    y: attacker.position.y - 20,
                    rotation: -0.5,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                }).to(attacker.position, {
                    x: attacker.position.x,
                    y: attacker.position.y,
                    duration: 0.08
                });

            break;



        }
        
    }
}


class Boundary {
    static width = 48;
    static height = 48;
    constructor({position}) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}