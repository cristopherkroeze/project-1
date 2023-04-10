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
    
    updatePos() {
        this.x -= this.speedX;
        this.y -= this.speedY;
        this.topSide = [this.x, this.y-this.radius];
        this.leftSide = [this.x-this.radius, this.y];
        this.bottomSide = [this.x, this.y+this.radius];
        this.rightSide = [this.x+this.radius, this.y];
        if (this.x <= 10) {
            this.changeDirectionX();
        } else if (this.x >=790) {
            this.changeDirectionX();
        }
        if (this.y <= 10) {
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
  
  }

class Obstacle {

    constructor(x, y, durability) {
      this.width = 48;
      this.height = 48;
      this.x = x;
      this.y = y;
      this.durability = durability;

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
    const randomObstacle = new Obstacle(randomX, randomY, randomDurability);
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
        console.log("BOTTOM SIDE PLATFORM COLLISION ZONE 1");
        ball.speedX = -0.25;
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX2[0] && ball.bottomSide[0] <= platformBorderX2[1]) {
        console.log("BOTTOM SIDE PLATFORM COLLISION ZONE 2");
        ball.speedX = -0.30;
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX3[0] && ball.bottomSide[0] <= platformBorderX3[1]) {
        console.log("BOTTOM SIDE PLATFORM COLLISION ZONE 3");
        if (ball.speedX < 0) {
          ball.speedX = -0.15;
        } else {
          ball.speedX = 0.15;
        }
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX4[0] && ball.bottomSide[0] <= platformBorderX4[1]) {
        console.log("BOTTOM SIDE PLATFORM COLLISION ZONE 4");
        ball.speedX = 0.30;
        ball.changeDirectionY();
    }
  }

  if (ball.bottomSide[1] >= platformBorderY[0] && ball.bottomSide[1] <= platformBorderY[1]) {
    if (ball.bottomSide[0] >= platformBorderX5[0] && ball.bottomSide[0] <= platformBorderX5[1]) {
        console.log("BOTTOM SIDE PLATFORM COLLISION ZONE 5");
        ball.speedX = 0.25;
        ball.changeDirectionY();
    }
  }
}

function updateObstacles(ball) {

  
    obstacles.forEach((element, index) => {
      ball.updatePos();
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
            ball.speedX = 0.30;
            ball.speedY = 0.30;
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
      ball.draw();
      updateObstacles(ball);
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