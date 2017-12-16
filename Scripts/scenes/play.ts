module scenes {
  export class Play extends objects.Scene {
    // PRIVATE INSTANCE VARIABLES
    // private _playLabel:objects.Label;
    // private _nextButton:objects.Button;
    private _gamepad:managers.GamePad;
    private _player:objects.Plane;
    private _keyboard:managers.Keyboard;
    private _mouse:managers.Mouse;

    private _enemies: objects.Enemy[];
    private _enemyNum: number;

    private _bullets: objects.P_Bullet[];
    private _bulletNum: number;
    private _bulletCounter: number;
  
    private _scoreLabel: objects.Label;
    
        private _score: number;

    //CONSTRUCTORS
    constructor(currentScene: number) {
      super();

      this._currentScene = currentScene;
      this._bulletFire = this._bulletFire.bind(this);

      // register button event handlers
      //this._nextButtonClick = this._nextButtonClick.bind(this);

      this.Start();
    }

    // PRIVATE METHODS
    // private _nextButtonClick(event:createjs.MouseEvent):void {
    //   this._currentScene = config.Scene.END;
    //   this.removeAllChildren();
    // }


    // PUBLIC METHODS
    public Start():void {
      // this._playLabel = new objects.Label("Play Scene", "60px", "Consolas", config.Color.BLACK, config.Screen.HALF_WIDTH, config.Screen.HALF_HEIGHT, true);
      // this._nextButton = new objects.Button("nextButton", config.Screen.HALF_WIDTH, config.Screen.HALF_HEIGHT + 70, true);
  
      this._player = new objects.Plane();

      // uncomment the next line to enable gamepad support
      //this._gamepad = new managers.GamePad(this._player, 0);
      this._mouse = new managers.Mouse(this._player);
      this._keyboard = new managers.Keyboard(this._player);
      
      this._enemyNum = 6;
      this._enemies = new Array<objects.Enemy>();

      this._bulletNum = 50;
      this._bullets = new Array<objects.P_Bullet>();
      this._bulletCounter = 0;
    
      this._score = 0;
      this._scoreLabel = new objects.Label("Score: " + this._score, "26px", "orecrusher3d", "#FFF", 400, 10, false);
      this.Main();
    }


    public Update():number {
      this._player.Update();
      // uncomment the next line to enable gamepad support
     // this._gamepad.Update();
      this._mouse.Update();
      this._keyboard.Update();
  
      this._enemies.forEach(enemy => {
        enemy.Update();
        this._checkCollision(enemy);
      });

      this._bullets.forEach(bullet => {
        bullet.Update();
        bullet._checkCollision(this._enemies);
      });

      if(this._score >= 1000){
        this._currentScene = config.Scene.END;
        
         window.removeEventListener("mousedown", this._bulletFire);
         this.removeAllChildren();
      }

      return this._currentScene;
    }

    public Main():void {
      // this.addChild(this._playLabel);
      // this.addChild(this._nextButton);
      
      var image = new createjs.Bitmap("./Assets/images/bg.png");
      this.addChild(image);

      for (let count = 0; count < this._bulletNum; count++) {
        this._bullets[count] = new objects.P_Bullet(this);
        this.addChild(this._bullets[count]);
      }

      for (let count = 0; count < this._enemyNum; count++) {
        this._enemies[count] = new objects.Enemy(this._player);
        this.addChild(this._enemies[count]);
      }

      this.addChild(this._player);      
      this.addChild(this._scoreLabel);
      
      // this._nextButton.on("click", this._nextButtonClick);
      window.addEventListener("mousedown", this._bulletFire);      
    }



    private _bulletFire(): void {
      console.log(this._player);
      this._bullets[this._bulletCounter].x = this._player.bulletSpawn.x;
      this._bullets[this._bulletCounter].y = this._player.bulletSpawn.y;
      
      var _dx = objects.Game.stage.mouseX - this._bullets[this._bulletCounter].x;
      var _dy = objects.Game.stage.mouseY - this._bullets[this._bulletCounter].y;

      var magnitude:number = Math.sqrt(_dx * _dx + _dy * _dy);
      
      this._bullets[this._bulletCounter].xSpeed = _dx / magnitude * 4;
      this._bullets[this._bulletCounter].ySpeed = _dy / magnitude * 4;
      
      var instance = createjs.Sound.play("./Assets/audio/turboblaster1.mp3");
      instance.volume = 0.5;

      this._bulletCounter++;
      console.log(this._bulletCounter);
      if (this._bulletCounter >= this._bulletNum - 1) {
        this._bulletCounter = 0;
      }
    }
  

    private _checkCollision(other: objects.GameObject) {
      let P1: createjs.Point = new createjs.Point(this._player.x, this._player.y);
      let P2: createjs.Point = other.position;

      // compare the distance between P1 and P2 is less than half the height of each object
      if ((Math.sqrt(Math.pow(P2.x - P1.x, 2) + Math.pow(P2.y - P1.y, 2))) <
        (this._player.halfHeight + other.halfHeight)) {
        if (!other.isColliding) {
          // if (other.name == "island") {
          //   this._score += 100;
          //   this._scoreLabel.text = "Score: " + this._score;
          //   var instance = createjs.Sound.play("explosion");
          //   instance.volume = 0.5;
          // }

          if (other.name == "enemy") {
            //this._lives -= 1;

            // if (this._lives <= 0) {
            //   this._currentScene = config.END;
            //   this._gameMusic.stop();

            var enemy = other as objects.Enemy;
            enemy.destroy();
            this._currentScene = config.Scene.END;
           
            window.removeEventListener("mousedown", this._bulletFire);
            this.removeAllChildren();
            // }
            // var instance = createjs.Sound.play("explosion");
            // instance.volume = 0.5;
            // this._livesLabel.text = "Lives: " + this._lives;

            // this.createExplosion(this._plane.x, this._plane.y);
          }
          
          other.isColliding = true;
        }
      } else {
        other.isColliding = false;
      }

    }

    public UpdateScore(score: number): void {
      this._score += 100;
      this._scoreLabel.text = "Score: " + this._score;
    }
  }
}
