class Animation {
  constructor(obj, type){
    this.position = createVector(obj.position.x, obj.position.y);
    this.type = type;
    this.timer = 0;

    if (this.type === "death" || this.type === "playerDeath"){
      this.color = obj.color;
      this.thickness = 0;
      this.radius = 0;

    } else if (this.type === "damage"){
      this.color = "#FFFFFF";
      this.radius = obj.radius;
      this.travel = obj.travel;
      if (obj.type === 1) this.direction = -1; else this.direction = 1;
      this.speed = obj.speed;
      this.startx = obj.startx;

    } else if (this.type === "teleportOut"){
      this.radius = obj.radius;
      this.color = obj.color;
      this.travel = obj.travel;
      this.speed = obj.speed;
      this.startx = obj.startx;

    } else if (this.type === "powerupStart"){
      this.color = "#00FF22";
      this.width = 1300;
      this.height = this.width*SHIP_RATIO;

    } else if (this.type === "powerup"){
      this.color = "#00B418"//"#00FF22";
      this.width = SHIP_WIDTH;
      this.height = this.width*SHIP_RATIO;
      this.speed = ship.speed;
      this.buffer = 6;

    }
  }

  update(){
    this.timer++;
    if (this.type === "death"){
      this.radius = -60*cos(map(this.timer, 0, 45, 0, 2*PI))+60;
      this.thickness = -20*cos(map(this.timer, 0, 45, 0, PI))+20;

    } else if (this.type === "damage"){
      this.position.y += this.speed;
      this.position.x = this.direction*sin(.01*this.position.y)*this.travel + this.startx;

    } else if (this.type === "playerDeath"){
      this.radius = -750*cos(.75*map(this.timer, 0, 45, 0, 2*PI))+750;
      this.thickness = -50*cos(.75*map(this.timer, 0, 45, 0, PI))+50;

    } else if (this.type === "teleportOut"){
      this.position.y += this.speed;
      this.position.x = sin(.01*this.position.y)*this.travel + this.startx;
      this.radius -= 2/3;

    } else if (this.type === "powerupStart"){
      this.width -= 43;
      this.height = this.width*SHIP_RATIO;

    }
  }

  show(){
    push();

    if (this.type === "death" || this.type === "playerDeath"){
      fill(35);
      stroke(this.color);
      strokeWeight(this.thickness);
      ellipse(this.position.x, this.position.y, this.radius);

    } else if (this.type === "damage"){
      fill(this.color);
      noStroke();
      ellipse(this.position.x, this.position.y, this.radius);

    } else if (this.type === "teleportOut"){
      fill(this.color);
      noStroke();
      ellipse(this.position.x, this.position.y, this.radius);

    } else if (this.type === "powerupStart"){
      noFill();
      strokeWeight(20);
      stroke(this.color);
      triangle( ship.position.x, ship.position.y+SHIP_LENGTH/2-this.height/2,
                ship.position.x-this.width, ship.position.y+SHIP_LENGTH/2+this.height/2,
                ship.position.x+this.width, ship.position.y+SHIP_LENGTH/2+this.height/2);

    } else if (this.type === "powerup"){
      fill(this.color);
      noStroke();
      triangle( ship.position.x, ship.position.y+SHIP_LENGTH/2-this.height/2-this.buffer*2,
                ship.position.x-this.width-this.buffer, ship.position.y+SHIP_LENGTH/2+this.height/2+this.buffer,
                ship.position.x+this.width+this.buffer, ship.position.y+SHIP_LENGTH/2+this.height/2+this.buffer);

    }

    pop();
  }

}
