class Enemy {
  constructor(type){
    this.type = type;

    if (this.type === 0){
      this.color = "#FF0000";
      this.travel = round(random(50, 150));
      this.radius = 22;
      this.speed = 2;
      this.health = 1;
      this.score = 50;

    } else if (this.type === 1){
      this.color = "#FF00FF";
      this.travel = round(random(100, 250));
      this.radius = 30;
      this.health = 2;
      this.speed = .6;
      this.score = 80;

    } else if (this.type === 2){
      this.color = "#AA00FF";
      this.travel = round(random(10, 40));
      this.radius = 20;
      this.health = 1;
      this.speed = 3.5;
      this.score = 110;

    } else if (this.type === 3){
      this.color = "#FF8500";
      this.travel = round(random(10, 30));
      this.radius = 40;
      this.health = 4;
      this.speed = .3;
      this.score = 140;
    }

    this.startx = round(random(this.travel, width-this.travel));
    this.position = createVector(this.startx, -10);
  }

  move(){
    if (this.type === 0){
      this.position.y += this.speed;
      this.position.x = sin(.01*this.position.y)*this.travel + this.startx;

    } else if (this.type === 1){
      this.position.y += this.speed;
      this.position.x = -sin(.01*this.position.y)*this.travel + this.startx;
      // pink pews
      if (random(360) < 2){
        shots.push(new Shot(this.position, PI/2, this.color, "enemy"));
      }

    } else if (this.type === 2){
      this.position.y += this.speed;
      this.position.x = sin(.01*this.position.y)*this.travel + this.startx;
      if (random(280) < 2){
        this.newX = constrain(this.position.x+random(-300, 300), this.travel, width-this.travel);
        this.newY = this.position.y-random(150, 250);
        animations.push(new Animation(this, "teleportOut"));
        this.startx = this.newX;
        this.position.x = this.newX;
        this.position.y = this.newY;

      }
    } else if (this.type === 3){
      this.position.y += this.speed;
      this.position.x = sin(.01*this.position.y)*this.travel + this.startx;
      if (random(420) < 2) {
        for (let i = 0; i < 8; i++){
          shots.push(new Shot(this.position, i*PI/4, this.color, "blue"));
        }
      }
    }
  }

  show(){
    push();
    fill(this.color);
    noStroke();

    ellipse(this.position.x, this.position.y, this.radius);

    pop();
  }

}
