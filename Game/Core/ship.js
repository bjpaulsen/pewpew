const SHIP_LENGTH = 45;
const SHIP_WIDTH = 14;
const LIFE_LENGTH = 18;
const LIFE_WIDTH = 5.7;
const SHIP_RATIO = 3.21428571;

class Ship {
  constructor(){
    this.position = createVector(width/2, height-250);
    this.speed = 5;
    this.radius = 20;
    this.color = "#FFFFFF";
    this.shotRate = 220;
  }

  show(){
    fill(this.color);
    stroke(this.color);
    strokeWeight(1);
    triangle(this.position.x, this.position.y, this.position.x-SHIP_WIDTH, this.position.y+SHIP_LENGTH, this.position.x+SHIP_WIDTH, this.position.y+SHIP_LENGTH);
  }

  move(){
    if (keyIsDown(LEFT_ARROW)) this.position.x = constrain(this.position.x-this.speed, 0+SHIP_WIDTH, width-SHIP_WIDTH);
    if (keyIsDown(RIGHT_ARROW)) this.position.x = constrain(this.position.x+this.speed, 0+SHIP_WIDTH, width-SHIP_WIDTH);
    if (keyIsDown(UP_ARROW)) this.position.y = constrain(this.position.y-this.speed, 0, height-SHIP_LENGTH);
    if (keyIsDown(DOWN_ARROW))  this.position.y = constrain(this.position.y+this.speed, 0, height-SHIP_LENGTH);
  }

  shoot(){
    shots.push(new Shot(this.position, -PI/2, this.color, "player"));
    if (this.shotRate < 220){
      shots.push(new Shot(this.position, -2*PI/5, this.color, "player"));
      shots.push(new Shot(this.position, -3*PI/5, this.color, "player"));
    }
    setTimeout(function(){if (keyIsDown(32)) ship.shoot()}, ship.shotRate);
  }
}

class Life {
  constructor(i){
    this.position = createVector(i*25+25+LIFE_WIDTH, height-30-LIFE_LENGTH);
    this.color = "#FFFFFF";
  }

  show(){
    fill(this.color);
    stroke(this.color);
    strokeWeight(1);
    triangle(this.position.x, this.position.y, this.position.x-LIFE_WIDTH, this.position.y+LIFE_LENGTH, this.position.x+LIFE_WIDTH, this.position.y+LIFE_LENGTH);
  }
}
