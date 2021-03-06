var sprites = {
  frog: {
    sx: 0,
    sy: 341,
    w: 38,
    h: 40,
    frames: 1
  },
  background: {
    sx: 420,
    sy: 0,
    w: 550,
    h: 625,
    frames: 1
  },
  car_blue: {
    sx: 6,
    sy: 6,
    w: 90,
    h: 50,
    frames: 1
  },
  car_green: {
    sx: 110,
    sy: 6,
    w: 90,
    h: 50,
    frames: 1
  },
  car_yellow: {
    sx: 210,
    sy: 6,
    w: 100,
    h: 50,
    frames: 1
  },
  truck_red: {
    sx: 5,
    sy: 64,
    w: 123,
    h: 43,
    frames: 1
  },
  truck_brown: {
    sx: 147,
    sy: 64,
    w: 200,
    h: 43,
    frames: 1
  },
  Trunk_M: {
    sx: 10,
    sy: 124,
    w: 188,
    h: 38,
    frames: 1
  },
  Trunk_B: {
    sx: 10,
    sy: 173,
    w: 245,
    h: 38,
    frames: 1
  },
  Trunk_S: {
    sx: 271,
    sy: 173,
    w: 128,
    h: 38,
    frames: 1
  },
  Turtle: {
    sx: 0,
    sy: 287,
    w: 56,
    h: 48,
    frames: 1
  },
  death: {
    sx: 210,
    sy: 127,
    w: 45,
    h: 36,
    frames: 1
  },
  Ini: {
    sx: 0,
    sy: 390,
    w: 300,
    h: 300,
    frames: 1
  }

};

var OBJECT_PLAYER = 1,
  OBJECT_FRIENDLY = 2,
  OBJECT_ENEMY = 4,
  OBJECT_WIN = 8,
  OBJECT_POWERUP = 16;


/// CLASE PADRE SPRITE
var Sprite = function () {}

Sprite.prototype.setup = function (sprite, props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w = SpriteSheet.map[sprite].w;
  this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function (props) {
  if (props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function (ctx) {
  SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}

Sprite.prototype.hit = function (damage) {
  this.board.remove(this);
}



// PLAYER

var PlayerFrog = function () {

    this.setup('frog', {
      vx: 0,
      vy: 0,
      frame: 0,
      reloadTime: 0.01,
      maxVel: 50
    });

    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
    this.subFrame = 0;
    this.reload = this.reloadTime;
    this.mov = '';
    this.dy = this.y;
    this.dx = this.x;
    this.angle = 0;

    this.movement = function (safe) {
      //All the conditions to move the frog with it´s animation only the distance of a row or column
      if (Game.keys['left'] && this.x - this.w >= 0) {
        this.vx -= 200;
        this.dx = this.x - this.w;
        this.mov = 'left';
        this.angle = -90;
      } else if (Game.keys['right'] && this.x + this.w <= Game.width - this.w) {
        this.vx += 200;
        this.dx = this.x + this.w;
        this.mov = 'right';
        this.angle = 90;
      } else if (Game.keys['up'] && this.y - 48 >= 0) {
        this.vy -= 200;
        this.dy = this.y - 48;
        this.mov = 'up';
        this.angle = 0;
      } else if (Game.keys['down'] && this.y + 48 <= Game.height - this.h) {
        this.vy += 200;
        this.dy = this.y + 48;
        this.mov = 'down';
        this.angle = 180;
      } else {
        //Check if I jumped to another friendly or to the ground
        if (safe)
          this.vx = safe.vx;
        else
          this.vx = 0;
        this.vy = 0;
      }

    }

    this.checkMovementY = function (safe, dt) {
      this.y += this.vy * dt;
      //Check if the frog has finished it´s movement in y
      if (this.mov == 'up' && this.y < this.dy) {
        this.y = this.dy;
        this.vy = 0;
        this.subFrame = 0;
        this.frame = 0;
      }
      if (this.mov == 'down' && this.y > this.dy) {
        this.y = this.dy;
        this.vy = 0;
        this.subFrame = 0;
        this.frame = 0;
      }

    }
    this.checkMovementX = function (safe, dt) {
        this.x += this.vx * dt;
        if (this.vy !== 0) {
          this.frame = Math.floor(this.subFrame++/ 7);
          }
          //When the frog finishes the jump to the left
          if (this.mov == 'left' && this.x < this.dx) {
            this.mov = '';
            //If the frog is safe, whether it is in a trunk or turtle
            if (safe) {
              //The speed becomes the speed of the trunk or turtle
              //The position becomes the destiny
              this.vx = safe.vx;
              this.x = this.dx;
            } else {
              this.vx = 0;
              this.x = this.dx;
            }
            this.subFrame = 0;
            this.frame = 0;
          }
          //When the frog finishes the jump to the right
          if (this.mov == 'right' && this.x > this.dx) {
            this.mov = '';
            //If the frog is safe, whether it is in a trunk or turtle
            if (safe) {
              //The speed becomes the speed of the trunk or turtle
              //The position becomes the destiny
              this.vx = safe.vx;
              this.x = this.dx;
            } else {
              this.vx = 0;
              this.x = this.dx;
            }
            this.subFrame = 0;
            this.frame = 0;
          }
        }
        this.step = function (dt) {

          //Check if the frog is in a friendly object such as a trunk or a turtle first
          var safe = this.board.collide(this, OBJECT_FRIENDLY);

          if (this.mov != 'left' && this.mov != 'right')
            this.dx = this.x;
          if (this.y == this.dy && this.x == this.dx) {
            //Update it´s movement
            this.movement(safe);

            //Check if collides with an enemy
            var collision = this.board.collide(this, OBJECT_ENEMY);

            //Check if the frog reached the end
            var win = this.board.collide(this, OBJECT_WIN);
          }
          if (win) {
            this.board.remove(this);
            winGame();
          } else {
            //Check if it´s dead
            if ((collision && !safe) || (this.x < 0 || this.x > Game.width - this.w)) {
              this.board.remove(this);
              this.board.add(new Death(this.x + this.w / 2,
                this.y + this.h / 2));
              loseGame();
            }
            //If the frog has not won or lose, check if it´s in a trunk or turtle and change it´s speed for the friendly object´s speed
            if ((safe && this.mov != 'left' && this.mov != 'right') || (safe && this.x == this.dx)) {
              this.vx = safe.vx;
            }
          }

          this.checkMovementY(safe, dt);
          this.checkMovementX(safe, dt);

          this.reload -= dt;
          if ((Game.keys['up'] || Game.keys['right'] || Game.keys['left'] || Game.keys['down']) && this.reload < 0) {
            Game.keys['up'] = false;
            Game.keys['right'] = false;
            Game.keys['left'] = false;
            Game.keys['down'] = false;
            this.reload = this.reloadTime;
          }

          if ((this.vx !== 0 && !safe) || (safe && this.x != this.dx && (this.mov == 'left' || this.mov == 'right'))) {
            this.frame = Math.floor(this.subFrame++/ 7);
            }
          }

        }
        PlayerFrog.prototype = new Sprite();
        PlayerFrog.prototype.type = OBJECT_PLAYER;
        PlayerFrog.prototype.draw = function (ctx) {

          var s = SpriteSheet.map[this.sprite];

          if (!this.frame) this.frame = 0;
          rotation = this.angle * Math.PI / 180;
          ctx.save();
          ctx.translate(this.x + s.w / 2, this.y + s.h / 2);
          ctx.rotate(rotation);
          ctx.drawImage(SpriteSheet.image, s.sx + this.frame * s.w,
            s.sy,
            s.w, s.h,
            -s.w / 2, -s.h / 2, s.w, s.h);
          ctx.restore();
        };


        /// ENEMIES

        var enemies = {
          car_blue: {
            x: -100,
            row: 7,
            respawn: 4000,
            vel: 70,
            sprite: 'car_blue',
          },
          car_yellow: {
            x: -100,
            row: 8,
            respawn: 4000,
            vel: 80,
            sprite: 'car_yellow',
          },
          car_green: {
            x: -100,
            row: 9,
            respawn: 4000,
            vel: 90,
            sprite: 'car_green',
          },
          truck_red: {
            x: -200,
            row: 10,
            respawn: 6000,
            vel: 60,
            sprite: 'truck_red',
          },
          truck_brown: {
            x: 550,
            row: 11,
            respawn: 5000,
            vel: -50,
            sprite: 'truck_brown',
          }
        };

        var Enemy = function (blueprint, override) {
          this.merge(this.baseParameters);
          this.setup(blueprint.sprite, blueprint);
          this.merge(override);
        }

        Enemy.prototype = new Sprite();
        Enemy.prototype.baseParameters = {
          t: 0,
          vx: 50
        };


        Enemy.prototype.type = OBJECT_ENEMY;

        Enemy.prototype.step = function (dt) {
          this.row_multiplier = Game.height / 13;
          this.vx = this.vel;
          this.vy = 0;
          this.x += this.vx * dt;
          this.y = this.row * this.row_multiplier;
          if (this.y > Game.height ||
            this.x > Game.width) {
            this.board.remove(this);
          }
        }
        //**************************************************************************** */
        /// FRIENDLY

        var friendly = {
          Trunk_M: {
            x: 550,
            row: 5,
            vel: -60,
            sprite: 'Trunk_M',
          },
          Trunk_B: {
            x: 550,
            row: 3,
            vel: -50,
            sprite: 'Trunk_B',
          },
          Trunk_S: {
            x: 550,
            row: 1,
            vel: -70,
            sprite: 'Trunk_S',
          },
          Turtle_F: {
            x: -200,
            row: 2,
            vel: 60,
            sprite: 'Turtle',
          },
          Turtle_L: {
            x: -200,
            row: 4,
            vel: 50,
            sprite: 'Turtle',
          }

        };

        var Friendly = function (blueprint, override) {
          this.merge(this.baseParameters);
          this.setup(blueprint.sprite, blueprint);
          this.merge(override);
        }

        Friendly.prototype = new Sprite();
        Friendly.prototype.baseParameters = {
          t: 0,
          vx: 50
        };


        Friendly.prototype.type = OBJECT_FRIENDLY;

        Friendly.prototype.step = function (dt) {
          this.row_multiplier = Game.height / 13;
          this.vx = this.vel;
          this.vy = 0;
          this.x += this.vx * dt;
          this.y = this.row * this.row_multiplier;
          if (this.y > Game.height ||
            this.x > Game.width) {
            this.board.remove(this);
          }
        }

        //********************************************************************************* */
        var Provider = function () {
          this.array_cars = [{
            car_type: enemies.car_blue,
            time: 4,
            respawn: 4
          }, {
            car_type: enemies.car_green,
            time: 5,
            respawn: 6
          }, {
            car_type: enemies.car_yellow,
            time: 5,
            respawn: 8
          }, {
            car_type: enemies.truck_red,
            time: 8,
            respawn: 10
          }, {
            car_type: enemies.truck_brown,
            time: 8,
            respawn: 15
          }];


          this.array_friendly = [{
              friendly_type: friendly.Trunk_M,
              time: 3,
              respawn: 5
            },
            {
              friendly_type: friendly.Trunk_B,
              time: 6,
              respawn: 10
            },
            {
              friendly_type: friendly.Trunk_S,
              time: 4,
              respawn: 4
            },
            {
              friendly_type: friendly.Turtle_F,
              time: 4,
              respawn: 4
            },
            {
              friendly_type: friendly.Turtle_L,
              time: 4,
              respawn: 4
            }
          ];
        }
        Provider.prototype.step = function (dt) {
          for (let i = 0; i < this.array_cars.length; i++) {
            this.array_cars[i].time += dt;
            if (this.array_cars[i].time >= this.array_cars[i].respawn) {
              this.board.add(new Enemy(this.array_cars[i].car_type));
              this.array_cars[i].time = 0;
            }
          }

          for (let i = 0; i < this.array_friendly.length; i++) {
            this.array_friendly[i].time += dt;
            if (this.array_friendly[i].time >= this.array_friendly[i].respawn) {
              this.board.add(new Friendly(this.array_friendly[i].friendly_type));
              this.array_friendly[i].time = 0;
            }
          }


        };
        Provider.prototype.draw = function () {};




        /// Game FIELD

        var Gamefield = function () {
          this.setup('background', {
            x: 0,
            y: 0
          });
        }
        Gamefield.prototype = new Sprite();
        Gamefield.prototype.step = function (dt) {};


        var Init = function () {
          this.setup('Ini', {
            x: Game.width / 4,
            y: 80
          });
        }
        Init.prototype = new Sprite();
        Init.prototype.step = function (dt) {};



        // Water
        var Water = function () {
          this.x = 0;
          this.y = 50;
          this.h = 241;
          this.w = 550;
        }

        Water.prototype = new Sprite();
        Water.prototype.type = OBJECT_ENEMY;
        Water.prototype.draw = function () {};
        Water.prototype.step = function () {};

        // Home
        var Home = function () {
          this.x = 0;
          this.y = 0;
          this.h = 48;
          this.w = 550;
        }

        Home.prototype = new Sprite();
        Home.prototype.type = OBJECT_WIN;
        Home.prototype.draw = function () {};
        Home.prototype.step = function () {};


        //Death

        var Death = function (centerX, centerY) {
          this.setup('death', {
            frame: 0,
          });
          this.x = centerX - this.w / 2;
          this.y = centerY - this.h / 2;
        }
        Death.prototype = new Sprite();
        Death.prototype.step = function () {};