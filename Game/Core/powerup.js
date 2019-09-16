class Powerup {
  constructor(type){
    this.type = type;

    this.length = 29;
    this.corner = 0;
    this.position = createVector(random(50, width-50), -10);
    this.speed = 2;
    this.color = "#00FF22";
  }

  move(){
    this.position.y += this.speed;

    if (frameCount % 30 === 0){
      if (this.color === "#00FF22"){
        this.color = "#C7FF00"
      } else {
        this.color = "#00FF22";
      }
    }
  }

  show(){
    push();
    noFill();
    strokeWeight(3);
    stroke(this.color);
    rect(this.position.x, this.position.y, this.length, this.length, this.corner);
    pop();

    push();
    noStroke();
    fill(this.color);
    if (this.type === 0){
      rect(this.position.x-7, this.position.y, 3, 15, 3);
      rect(this.position.x, this.position.y, 3, 15, 3);
      rect(this.position.x+7, this.position.y, 3, 15, 3);
    } else if (this.type === 1){
      strokeWeight(1);
      stroke(this.color);
      triangle(this.position.x, this.position.y-9, this.position.x-LIFE_WIDTH, this.position.y+LIFE_LENGTH-9, this.position.x+LIFE_WIDTH, this.position.y+LIFE_LENGTH-9);
    }
    pop();
  }

}
