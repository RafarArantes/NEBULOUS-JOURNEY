window.addEventListener('load', function(){
    // canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 2000;
    canvas.height = 500;

      // Carregar sons
      const shootSound = new Audio('music\\tiro.mp3');
      shootSound.volume = 0.1; // Ajustar o volume do tiro
      const explosionSound = new Audio('music\\explosion.mp3');

       

      // Classe para inserção de ações nas teclas
    class InputHandler{
        constructor(game){
            this.game = game;
            this.mouseClick = false;
            this.mouseX = 0;
            this.mouseY = 0;
            window.addEventListener('keydown', e => {
                if ((['ArrowUp', 'w'].includes(e.key) || ['ArrowDown', 's'].includes(e.key)) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);    
                } else if (e.key === ' '){
                    this.game.player.shootTop();
                } else if (e.key === 'd'){
                    this.game.debug = !this.game.debug;
                }
            });
            window.addEventListener('keyup', e =>{
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });
            window.addEventListener('click', e => {
                this.mouseClick = true;
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
    
           
        }
    }

    // Classe de projetil
    class Projectile{
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        // Velocidade do projetil no canvas
        update(){
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
        // Desenho do projetil no canvas
        draw(context){
            context.drawImage(this.image, this.x, this.y);
        }
    }

    // Classe do jogador
    class Player {
        constructor(game){
            this.game = game;
            this.width = 64;
            this.height = 60;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.speedY = 0;
            this.maxSpeed = 3;
            this.projectiles = [];
            this.image = document.getElementById('player'); 
            this.fps = 5; // Ajuste o FPS desejado
            this.timer = 0;
            this.interval = 1000 / this.fps; // Ajuste de velocidade de frames e looping
            this.maxFrame = 2;
            this.markedForDeletion = false;
        }
        
        update(deltaTime){
            // Movimentação vertical
            if (this.game.keys.includes('ArrowUp') || this.game.keys.includes('w')) this.speedY = -5;
            else if (this.game.keys.includes('ArrowDown') || this.game.keys.includes('s')) this.speedY = 5;
            else this.speedY = 0;
            this.y += this.speedY;
            
            // Limites verticais
            if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
            else if (this.y < 0) this.y = 0;
            
            // Atualização dos projéteis
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            
            // Animação do sprite
            if (this.timer > this.interval){
                this.frameX++;
                if (this.frameX > this.maxFrame) this.frameX = 0;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
        }
        
        draw(context){
            // Posição de impacto do tiro
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }
        
        shootTop(){
            // Ação de tiro junto com o som e a função para verificar se tem balas
            if (this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30)); // Ajuste de posição para que o projétil pareça sair do jogador
                this.game.ammo--;
                audio.volume = 0.1;
                shootSound.play();
            }
        }
    }
    
    
    // Classe Inimigo(Pai)
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            
        }
        update(deltaTime){
            // Velocidade dos inimigos
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            // Animação do sprite
            if (this.timer > this.interval){
                this.frameX++;
                if (this.frameX > this.maxFrame) this.frameX = 0;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
        }
        draw(context) {
            // Desenho dos inimigos no Canvas
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }
    
    // classe inimigo filho 1(Alien)
    class Angler1 extends Enemy {
        constructor(game){
            super(game);
            this.width = 64;
            this.height = 64;
            this.y = Math.random() * (this.game.height * 0.9 - this.height); // Aparição randomica no mapa
            this.image = document.getElementById('angler1'); 
            this.lives = 2; // vida do inimigo
            
            
        }
    }

    // classe inimigo filho 2(Asteroide)
    class Angler2 extends Enemy {
        constructor(game){
            super(game);
            this.width = 63;
            this.height = 61;
            this.y = Math.random() * (this.game.height * 0.9 - this.height); // Aparição randomica no mapa
            this.image = document.getElementById('angler2');
            this.lives = 3;
            
            
        }
    }
    
    // classe inimigo filho 3(Satelite)
    class Angler3 extends Enemy {
        constructor(game){
            super(game);
            this.width = 63;
            this.height = 61;
            this.y = Math.random() * (this.game.height * 0.9 - this.height); // Aparição randomica no mapa
            this.image = document.getElementById('angler3');
            this.lives = 99999999;
            
            
        }
    }
    

    // classe de camadas para looping de imagem
    class Layer {
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = image.width;
            this.height = image.height;
            this.x = 0;
            this.y = 0;
            // Calcular a escala para cobrir o canvas
            this.scaleX = this.game.width / this.width;
            this.scaleY = this.game.height / this.height;
        }
        update(deltaTime){
            this.x -= this.game.speed * this.speedModifier
            // Verificar se a imagem saiu completamente da visão à esquerda
            if (this.x <= -this.width * this.scaleX) {
                this.x = 0;
            }
        }
        draw(context){
            // Desenhar a imagem com escala para cobrir todo o canvas
            context.drawImage(this.image, this.x, this.y, this.width * this.scaleX, this.height * this.scaleY);
            context.drawImage(this.image, this.x + this.width * this.scaleX, this.y, this.width * this.scaleX, this.height * this.scaleY);
        }
    }

    // classe de plano de fundo
    class Background {
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.layer1 = new Layer(this.game, this.image1, 1);
            this.layers = [this.layer1];
        }
        update(){
            this.layers.forEach(layer => layer.update());
        }
        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    // classe de explosão PAI
    class Explosion{
        constructor(game, x, y){
            this.game = game;
            this.frameX = 0;
            this.spriteHeight = 200;
            this.spriteWidth = 200;
            this.x = x;
            this.y = y;
            this.fps = 15;
            this.timer = 0;
            this.interval = 1000 / this.fps;
            this.markedForDeletion = false;
            this.maxFrame = 8;
        }
        update(deltaTime){
            if (this.timer > this.interval){
                this.frameX++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.frameX > this.maxFrame) this.markedForDeletion = true;
        }

        
        
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth,
                this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);
        }
        
    }

    // classe para fumaça de explosão filho
    class SmokeExplosion extends Explosion {
        constructor(game, x, y){
            super(game, x, y);
            this.image = document.getElementById('smokeExplosion');
            this.spriteWidth = 200;
            this.spriteHeight = 200;
        }
    }

    // classe de HUD 
    class UI {
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';

            
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // score
            context.fillText('Score: ' + this.game.score, 20, 40);
            // ammo
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            // timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            
            // game over messages
            if (this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                
                    message1 = 'VOCÊ PERDEU!';
                    message2 = 'Pegue seu kit de reparo e tente novamente!';
                
                context.font = '70px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
                retryButton.style.display = 'block';
                iniButton.style.display = 'block';
              
            }
            context.restore();
        }
    }

    // Classe principal do jogo
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000; // Intervalo inicial de criação de inimigos (em milissegundos)
            this.maxEnemyInterval = 500; // Intervalo mínimo de criação de inimigos (em milissegundos)
            this.ammo = 20; // quantidade inicial de munição
            this.maxAmmo = 50; // quantidade maxima de munição
            this.ammoTimer = 0;
            this.ammoInterval = 900;
            this.gameOver = false; 
            this.score = 0;
            this.speed = 1; // velocidade inicial
            this.gameTime = 0; // tempo de jogo inicial
            this.speedIncreaseInterval = 1000; // aumenta a cada 1000 milissegundos (1 segundo)
            this.scoreRatePerSecond = 1; // Taxa de pontos por segundo
                      
            

        }
        update(deltaTime){

            // função de gameover
            if (!this.gameOver) this.gameTime += deltaTime;
            
            this.background.update();
            this.background.layer1.update();
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval){
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            // progressão de dificuldade ( aumento de velocidade do jogo)
            this.speed += this.gameTime / 10000000;
            this.enemyInterval = Math.max(this.maxEnemyInterval, this.enemyInterval - this.gameTime / 10000);
            // função para score ser o mesmo que o tempo sobrevivido
            this.score = Math.floor(this.gameTime * 0.001 * this.scoreRatePerSecond);
            // função de explosão
            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)){
                    this.gameOver = true; // Game over se o jogador colidir com um inimigo
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        
                        if (enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            this.addExplosion(enemy);
                            if (!this.gameOver) this.score += enemy.score;
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        
            this.explosions.forEach(explosion => {
                explosion.draw(context);
            });
        }
        
        addEnemy() {
    // randomizador de criação de inimigo
    const randomize = Math.random();
    if (randomize < 0.3) {
        this.enemies.push(new Angler2(this));
    } else if (randomize < 0.6) {
        this.enemies.push(new Angler1(this));
    } else {
        this.enemies.push(new Angler3(this));
    }
}

        addExplosion(enemy){
            // função de posicionamento da explosão
            this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * -1, enemy.y + enemy.height * -1));
            explosionSound.play();
    
        }
        checkCollision(rect1, rect2){
            // checagem de colisão
            return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y);
        }
    }

     // Referência ao botão Retry
     const retryButton = document.getElementById('botao');
     const iniButton = document.getElementById('botaoInicio');

     // Event listener para o botão Retry
     retryButton.addEventListener('click', () => {
         // Reinicia o jogo
         game.gameOver = false;
         game.score = 0;
         game.gameTime = 0;
         game.ammo = 20;
         game.enemies = [];
         game.explosions = [];
         game.speed = 1;
         game.enemyInterval = 2000;
         game.maxEnemyInterval = 500;
         game.enemyTimer = 0;
         retryButton.style.display = 'none'; // Oculta o botão Retry após reiniciar o jogo
         iniButton.style.display = 'none'; // Oculta o botão Voltar ao menu após reiniciar o jogo
         
     });
    
    
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        
        requestAnimationFrame(animate);
    }
    animate(0);
    
});
