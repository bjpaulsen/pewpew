const PLAYER_SHOT_SPEED = 8;
const ENEMY_SHOT_SPEED = 4;
const BLUE_SHOT_SPEED = 3;

class Shot {
  constructor(spot, angle, color, side){
    this.side = side;
    this.position = createVector(spot.x, spot.y);
    this.size = 5;
    this.color = color;
    if (this.side === "enemy"){
      let dx = ship.position.x - spot.x;
      let dy = ship.position.y - spot.y + SHIP_LENGTH/2;
      angle = atan2(dy, dx);
      this.speed = ENEMY_SHOT_SPEED;
    } else if (this.side === "player"){
      this.speed = PLAYER_SHOT_SPEED;
    } else if (this.side === "blue"){
      this.speed = BLUE_SHOT_SPEED;
    }
    let tempVel = p5.Vector.fromAngle(angle);
    this.velocity = tempVel.mult(this.speed);
  }

  show(){
    push();
    stroke(this.color);
    strokeWeight(this.size);
    point(this.position.x, this.position.y);
    pop();
  }

  move(){
    this.position.add(this.velocity);
  }
}
