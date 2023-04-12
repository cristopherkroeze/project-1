const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const obstacles = [];
let gameStarted = false;
let points = 0;


function resetCanvas(callback) {
    ctx.clearRect(0, 0, 800, 800); 
    const background = new Image();
    background.src = "./images/background.png";
    ctx.drawImage(background, 0, 0, 800, 800);
    if (callback) {
      callback();
    }
  }


class Ball {
    constructor() {
        this.x = 350;
        this.y = 764;
        this.radius = 10;
        this.speedX = 0;
        this.speedY = 0;
        this.topSide = [this.x, this.y+this.radius];
        this.leftSide = [this.x-this.radius, this.y];
        this.bottomSide = [this.x, this.y-this.radius];
        this.rightSide = [this.x+this.radius, this.y];
    }

    changeDirectionX() {
        this.speedX = 0 - this.speedX;
    }

    changeDirectionY() {
        this.speedY = 0 - this.speedY;
    }

    updateSpeedY(speed) {
      this.speedY = speed;
    }

    updateSpeedX(speed) {
      this.speedX = speed;
    }

    resize() {
      this.radius = 10;
    }
    
    updatePos() {
        this.x -= this.speedX;
        this.y -= this.speedY;
        this.topSide = [this.x, this.y-this.radius];
        this.leftSide = [this.x-this.radius, this.y];
        this.bottomSide = [this.x, this.y+this.radius];
        this.rightSide = [this.x+this.radius, this.y];
        if (this.x-this.radius <= 0) {
            this.changeDirectionX();
        } else if (this.x+this.radius >=800) {
            this.changeDirectionX();
        }
        if (this.y-this.radius <= 0) {
            this.changeDirectionY();
        } else if (this.y >= 800) {
            endGame();
        }
        this.draw();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
    }
}


class Platform {
    constructor() {
      this.x = 300;
      this.y = 775;
      this.height = 25;
      this.width = 100;
    }
  
    moveRight() {
      this.x += 25;
      if (this.x >= 700) {
        this.x = 700;
      }
    }
  
    moveLeft() {
      this.x -= 25;
      if (this.x <= 0) {
        this.x = 0;
      }
    }
  
    draw() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "black";
      ctx.fill();
    }

    resize() {
      this.width = 100;
    }
  
  }

class Obstacle {

    constructor(x, y, durability, powerup) {
      this.width = 48;
      this.height = 48;
      this.x = x;
      this.y = y;
      this.durability = durability;
      this.containsPowerUp = powerup;

      const img = new Image();
      if (durability === 1) {
        img.src = './images/dirtblock.png';
      } else if (durability === 2) {
        img.src = './images/grassblock.png';
      } else if (durability === 3) {
        img.src = './images/deadgrassblock.png';
      } 
      this.img = img;
    }
  
    updateSprite() {
      const img = new Image();
      if (this.durability === 1) {
        img.src = './images/dirtblock.png';
      } else if (this.durability === 2) {
        img.src = './images/grassblock.png';
      } else if (this.durability === 3) {
        img.src = './images/deadgrassblock.png';
      } 
      this.img = img;
      this.draw();
    }

    reduceDurability() {
        this.durability--;
        this.updateSprite();
        return this.durability;
    }
  
    draw() {
      if(!this.durability<=0) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
  
  }

  function generateObstacles() {
    let i = 0;
    while (i<15) {
        createObstacle();
        i++;
    }
  }

function createObstacle() {
    let randomX = Math.floor(Math.random() * 753);
    let randomY = Math.floor(Math.random() * 501);
    if (randomY<=55) {
        randomY = 55;
    };
    let randomDurability = Math.floor(Math.random() * 3) + 1;
    let randomPowerUp = Math.floor(Math.random()*11);
    let powerUp;
    if (randomPowerUp <= 2) {
      console.log("random block received powerup");
      powerUp = true;
    } else {
      powerUp = false;
    };
    const randomObstacle = new Obstacle(randomX, randomY, randomDurability, powerUp);
    obstacles.push(randomObstacle);
  }

function updatePlatform (platform, ball) {
  let platformBorderX1 = [platform.x, (platform.x+platform.width/5)];
  let platformBorderY = [platform.y, (platform.y+platform.height)];
  let platformBorderX2 = [(platform.x+platform.width/5), (platform.x+(platform.width/5)*2)];
  let platformBorderX3 = [(platform.x+(platform.width/5)*2), (platform.x+(platform.width/5)*3)];
  let platformBorderX4 = [(platform.x+(platform.width/5)*3), (platform.x+(platform.width/5)*4)];
  let platformBorderX5 = [(platform.x+(platform.width/5)*4), (platform.x+platform.width)];




  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX1[0] && ball.bottomSide[0] <= platformBorderX1[1]) {
        ball.speedX = -2.5;
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX2[0] && ball.bottomSide[0] <= platformBorderX2[1]) {
        ball.speedX = -3;
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX3[0] && ball.bottomSide[0] <= platformBorderX3[1]) {
        if (ball.speedX < 0) {
          ball.speedX = -1.5;
        } else {
          ball.speedX = 1.5;
        }
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX4[0] && ball.bottomSide[0] <= platformBorderX4[1]) {
        ball.speedX = 3;
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX5[0] && ball.bottomSide[0] <= platformBorderX5[1]) {
        ball.speedX = 2.5;
        ball.changeDirectionY();
    }
  }
}

function resizePlatform(platform) {
  platform.width = 100;
}

function resizeBall(ball) {
  ball.radius = 10;
}

function updateObstacles(ball, platform) {

  
    obstacles.forEach((element, index) => {
      element.updateSprite();
      let obstacleBorderX = [element.x, (element.x+element.width)];
      let obstacleBorderY = [element.y, (element.y+element.height)];
      
      if(ball.leftSide[0] >= obstacleBorderX[0] && ball.leftSide[0] <= obstacleBorderX[1]) {
        if(ball.leftSide[1] >= obstacleBorderY[0] && ball.leftSide[1] <= obstacleBorderY[1]){
          element.reduceDurability();
          ball.changeDirectionX();
        }
      } else if ((ball.rightSide[0] >= obstacleBorderX[0] && ball.rightSide[0] <= obstacleBorderX[1])) {
         if (ball.rightSide[1] >= obstacleBorderY[0] && ball.rightSide[1] <= obstacleBorderY[1]) {
           element.reduceDurability();
           ball.changeDirectionX();
         }
      } 
      if (ball.topSide[1] >= obstacleBorderY[0] && ball.topSide[1] <= obstacleBorderY[1]) {
         if (ball.topSide[0] >= obstacleBorderX[0] && ball.topSide[0] <= obstacleBorderX[1]) {
            element.reduceDurability();
            ball.changeDirectionY();
         }
      } else if (ball.bottomSide[1] >= obstacleBorderY[0] && ball.bottomSide[1] <= obstacleBorderY[1]) {
         if (ball.bottomSide[0] >= obstacleBorderX[0] && ball.bottomSide[0] <= obstacleBorderX[1]) {
            element.reduceDurability();
            ball.changeDirectionY();
         }
      }

      if(element.durability <= 0) {
        obstacles.splice(index, 1);
        points++;
        if (element.containsPowerUp) {
          randomPower = Math.floor(Math.random()*3);
          if (randomPower === 0) {
              console.log("doubling ball radius for 5 seconds");
              ball.radius = ball.radius * 2;
              ball.updatePos();
              ball.draw();
              setTimeout(()=> {ball.radius = 10}, 5000);
          } else if (randomPower === 1) {
              console.log("doubling platform width for 5 seconds");
              platform.width = platform.width * 2;
              platform.draw();
              setTimeout(() => {platform.width = 100}, 5000);
          } else if (randomPower === 2) {
              console.log("removing obstacles");
              if(obstacles.length >= 6) {
                console.log("removing 3 obstacles");
                obstacles.splice(0, 3);
              } else if (obstacles.length >= 4) {
                console.log("removing 2 obstacles");
                obstacles.splice(0,2);
              } else if (obstacles.length >= 2) {
                console.log("removing 1 obstacles");
                obstacles.splice(0,1);
              } else if (!obstacles.length) {
                victory();
              }
          };
        };
      }

      if(!obstacles.length) {
        victory();
      }
     
    })
}

function endGame() {


    clearInterval(updateInterval);
    document.getElementById('game-intro').innerHTML = "<p></p>";
    document.getElementById('game-board').innerHTML = `<p id="game-over">GAME OVER</p><p>Point Total: ${points}</p>`
  }
  
  function victory() {
    clearInterval(updateInterval);
    document.getElementById('game-intro').innerHTML = "<p></p>";
    document.getElementById('game-board').innerHTML = `<p id="win-condition">VICTORY!</p><p>Point Total: ${points}</p>`
  }

function startGame() {
    let upPressed = false;
    if (gameStarted === false) {
    gameStarted = true;
    
    const platform = new Platform();
    const ball = new Ball();
    // register platform controls
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37:
            platform.moveLeft();
          break;
        case 38:
            if (!upPressed) {
            ball.speedX = 3;
            ball.speedY = 3;
            upPressed = true;
            }
          break;
        case 39:
            platform.moveRight();
          break;
      }
  
    };
  
    generateObstacles();

///Why is the ball speed dependent on the number of objects in the array?

    // update canvas
    window.updateInterval = setInterval(() => {
      resetCanvas();
      platform.draw();
      ball.updatePos();
      ball.draw();
      updateObstacles(ball, platform);
      updatePlatform(platform, ball);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`Points: ${points}`, 10, 50);
    }, 16);
  }
  
  }

window.onload = () => {
    document.getElementById('start-button').onclick = () => {
      startGame();
    };
};