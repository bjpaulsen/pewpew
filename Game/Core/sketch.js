const PI = 3.1415;
const POWERUP_TIME = 6000;
const STARTING_RATE = 940;
const RATE_INCREMENT = 3.8;
const STARTING_LIVES = 3;
let rate = STARTING_RATE;
let level = 0;
let score = 0;
let highscore = 0;
let ship;
let lives = [];
let shots = [];
let enemies = [];
let animations = [];
let powerups = [];

let rateInterval;
let powerupInterval;
let spawnTimer;
let level1Timer;
let level2Timer;
let level3Timer;
let tutorialInterval;

function setup(){
  createCanvas(600, 800);
  frameRate(60);
  rectMode(CENTER);
  ship = new Ship();
  intro();
}

function spawn(){
    enemies.push(new Enemy(round(random(level))));
    spawnTimer = setTimeout(spawn, rate);
    if (rate < 300) clearInterval(rateInterval);
}

function draw(){
  background(35);

  // update and delete enemies
  updateEnemeies();
  // update and delete shots
  updateShots();
	// handle powerups
  updatePowerups();
  // update and delete animations
  updateAnimations();

  for (let elt of lives){
    elt.show();
  }

  // update ship
  ship.show();
  ship.move();

  // prioritize damage & endgame animation visual
  for (let damage of animations){
    if (damage.type === "damage" || damage.type === "playerDeath"){
      damage.show();
    }
  }

}

function updateEnemeies(){
	// update and delete enemies
  for (let i = enemies.length-1; i >= 0; i--){
    enemies[i].move();
    enemies[i].show();
    if (enemies[i].position.y > (height + enemies[i].radius)){
      enemies.splice(i, 1);
      lives.splice(lives.length-1);
      if (lives.length === 0) endGame();
    } else if (dist(enemies[i].position.x, enemies[i].position.y, ship.position.x, ship.position.y+SHIP_LENGTH/2) < enemies[i].radius){
      animations.push(new Animation(enemies[i], "death"));
      enemies.splice(i, 1);
      lives.splice(lives.length-1);
      if (lives.length === 0) endGame();
    }
  }
}

// update and delete shots and enemies
function updateShots(){
  // cycle through every shot
  for (let i = shots.length-1; i >= 0; i--){
	// update and draw each shot
    shots[i].move();
    shots[i].show();

	// cycle through every enemy
    for (let j = enemies.length-1; j >= 0; j--){
	  // if this is a player's shot, then...
      if (shots[i].side === "player"){
		// if this player's shot is touching an enemy, then...
        if (dist(enemies[j].position.x, enemies[j].position.y, shots[i].position.x, shots[i].position.y) < enemies[j].radius){
		  // reduce the enemy's health
          enemies[j].health--;
		  // if that enemy's health is 0, then...
          if (enemies[j].health === 0){
			// start a death animation, update the score, destroy the enemy
            animations.push(new Animation(enemies[j], "death"));
            score += enemies[j].type*30+50;
            document.getElementById("score").innerHTML = score;
            enemies.splice(j, 1);
		  // if the enemy is hurt but not destroyed, then...
          } else {
			  // play the damage animation
			  animations.push(new Animation(enemies[j], "damage"));
          }
		  // and finally, delete the shot in question and go to the next loop.
          shots.splice(i, 1);
          break;
        }
	  // if this is an enemy shot, then...
      } else {
		// if this enemy shot is touching the player, then...
        if (dist(ship.position.x, ship.position.y+SHIP_LENGTH/2, shots[i].position.x, shots[i].position.y) < ship.radius){
		  // the player loses a life
          lives.splice(lives.length-1, 1);
		  // if the player has 0 lives, end the game
          if (lives.length === 0){
            endGame();
          }
		  // delete the shot & go to the next loop
          shots.splice(i, 1);
          break;
        }
      }
    }

	// if the shot is offscreen, delete it
    if (shots[i] && (shots[i].position.y < 0 || shots[i].position.y > height || shots[i].position.x > width || shots[i].position.x < 0)){
      shots.splice(i, 1);
    }
  }
}

function updatePowerups(){
	for (let i = powerups.length-1; i >= 0; i--){
    powerups[i].move();
    powerups[i].show();
    if (powerups[i].position.y > height+powerups[i].length){
      powerups.splice(i, 1);
    } else if (dist(powerups[i].position.x, powerups[i].position.y, ship.position.x, ship.position.y+SHIP_LENGTH/2) < ship.radius+2*powerups[i].length/3){
      animations.push(new Animation(ship, "powerupStart"));
      setTimeout(function(){animations.push(new Animation(ship, "powerup"))}, 500);
      if (powerups[i].type === 0){
        ship.shotRate = 180;
        setTimeout(function(){ship.shotRate = 220}, POWERUP_TIME);
      } else if (powerups[i].type === 1){
        addLife();
        setTimeout(addLife, 20);
        //setTimeout(addLife, 40);
      }
      powerups.splice(i, 1);
    }
  }
}

function updateAnimations(){
	for (let i = animations.length-1; i >= 0; i--){
    animations[i].update();
    animations[i].show();
    if (animations[i].type === "death"){
      if (animations[i].timer >= 43){
        animations.splice(i, 1);
      }
    } else if (animations[i].type === "damage" || animations[i].type === "playerDamage"){
      if (animations[i].timer >= 15){
        animations.splice(i, 1);
      }
    } else if (animations[i].type === "playerDeath"){
      if (animations[i].timer >= 30){
        animations.splice(i, 1);
      }
    } else if (animations[i].type === "teleportIn" || animations[i].type === "teleportOut"){
      if (animations[i].timer >= 30){
        animations.splice(i, 1);
      }
    } else if (animations[i].type === "powerupStart"){
      if (animations[i].timer >= 30){
        animations.splice(i, 1);
      }
    } else if (animations[i].type === "powerup"){
      if (animations[i].timer >= 360){
        animations.splice(i, 1);
      }
    }
  }
}

function endGame(){
	if (highscore < score) {
    highscore = score;
    document.getElementById("highscore").innerHTML = highscore;
  	document.getElementById("newhs").innerHTML = "New\u00a0Highscore!";
  }
  document.getElementById("gameover").innerHTML = "GAME\u00a0OVER";
  document.getElementById("restart").innerHTML = "R\u00a0to\u00a0Restart.";
  clearTimeout(spawnTimer);
  clearInterval(rateInterval);
  clearInterval(powerupInterval);
  clearTimeout(level1Timer);
  clearTimeout(level2Timer);
  clearTimeout(level3Timer);
  level = 0;
  rate = STARTING_RATE;
  animations.push(new Animation(ship, "playerDeath"));
  setTimeout(function(){enemies=[];shots=[];powerups=[];
	ship.position.x=width/2;ship.position.y=height-250;}, 420);
  setTimeout(function(){shots=[];animations=[];}, 420);
  setTimeout(function(){
		noLoop();
		ship.position.x=width/2;
		ship.position.y=height-250;
		shots=[]
		if (highscore < score) {
    highscore = score;
    document.getElementById("highscore").innerHTML = highscore;
  }}, 500);
}

function restart(){
  document.getElementById("score").innerHTML = 0;
  document.getElementById("gameover").innerHTML = " ";
  document.getElementById("newhs").innerHTML = " ";
  document.getElementById("restart").innerHTML = " ";
  ship.position.x = width/2;
  ship.position.y = height-250;
  lives = [];
  enemies = [];
  shots = [];
  powerups = [];
  animations = [];
  clearTimeout(spawnTimer);
  clearInterval(rateInterval);
  clearInterval(powerupInterval);
  clearTimeout(level1Timer);
  clearTimeout(level2Timer);
  clearTimeout(level3Timer);
  for (let i = 0; i < STARTING_LIVES; i++) {
    lives.push(new Life(i));
  }
  level = 0;
  score = 0;
  if (highscore > 0) document.getElementById("highscore").innerHTML = highscore;
  rate = STARTING_RATE;
  rateInterval = setInterval(function(){rate-=RATE_INCREMENT;}, 1000);
  powerupInterval = setInterval(function(){powerups.push(new Powerup(round(random())));}, 20000);
  level1Timer = setTimeout(function(){level++;}, 13000);
  level2Timer = setTimeout(function(){level++;}, 25000);
  level3Timer = setTimeout(function(){level++;}, 35000);
  spawn();
  loop();
}

function intro(){
  noLoop();
  document.getElementById("score").innerHTML = " ";
  document.getElementById("highscore").innerHTML = " ";
  document.getElementById("gameover").innerHTML = " ";
  document.getElementById("newhs").innerHTML = " ";
  document.getElementById("restart").innerHTML = " ";
  ship.position.x = -50;
  ship.position.y = height-250;
  lives = [];
  enemies = [];
  shots = [];
  powerups = [];
  animations = [];
  clearTimeout(spawnTimer);
  clearInterval(rateInterval);
  clearInterval(powerupInterval);
  clearTimeout(level1Timer);
  clearTimeout(level2Timer);
  clearTimeout(level3Timer);
  level = 0;
  score = 0;
  rate = 0;

  document.getElementById("intro").innerHTML = "Get\u00a0Ready!";

  setTimeout(function(){
    ship.position.x = -50;
    enemies.push(new Enemy(0));
    document.getElementById("intro").innerHTML = "3";
  }, 1000);

  setTimeout(function(){
    document.getElementById("intro").innerHTML = "3 2";
  }, 2000);

	setTimeout(function(){
    document.getElementById("intro").innerHTML = "3 2 1";
  }, 3000);

	setTimeout(function(){
    document.getElementById("intro").innerHTML = "3\u00a02\u00a01\u00a0GO!";
  }, 4000);

	setTimeout(function(){
    document.getElementById("intro").innerHTML = " ";
		restart();
  }, 5000);
}

// helper functions

function keyPressed(){
  switch (keyCode){
    case 32:
      ship.shoot();
      break;
    case 82:
      if (rate === STARTING_RATE) intro();
      break;
  }
}

function addLife(){
  lives.push(new Life(lives.length));
}
