module objects {
  export class Enemy extends objects.GameObject {
    private i: number;
    private xSpawn: number;
    private ySpawn: number;
    private angle: number;
    private _player: objects.Plane;

    // PUBLIC PROPERTIES

    // CONSTRUCTORS
    constructor(player: objects.Plane) {
      super("enemy");
      this.i = Math.random() * - 20;
      this._player = player;


      this.Start();
    }

    // PRIVATE METHODS
    private _reset(): void {
      // this.i = Math.random() * - 20;

      this.y = (Math.random() * (1200 - this.height));
      this.x = (Math.random() * (1200 - this.width));


      this.position.x = this.x;
      this.position.y = this.y;

      // this.xSpawn = (Math.random() * (520 - this.width)) + this.halfWidth;
      // this.ySpawn = (Math.random() * (20 - this.height)) + this.halfWidth;

      // this.position.x = this.xSpawn;
      // this.position.y = this.ySpawn;

      // this.verticalSpeed = (Math.random() * 5) + 2;
      // this.angle = (Math.random() * 0.2);
    }

    private _checkBounds(): void {
      if (this.y >= 580 + this.height) {
        this._reset();
      }
    }

    // PUBLIC METHODS
    public Start(): void {
      this._reset();
    }

    private _updatePosition(): void {
      // this.x = -Math.sin(this.i) * 40 + this.xSpawn; // * PHASE + OFFSET
      // this.y = this.i * 22 + this.ySpawn;
      // this.position.x = this.x;
      // this.position.y = this.y;
      // this.i += this.angle;

      var _dx = this._player.x - this.x;
      var _dy = this._player.y - this.y;

      var magnitude: number = Math.sqrt(_dx * _dx + _dy * _dy);

      this.x += _dx / magnitude;
      this.y += _dy / magnitude;

      var direction = Math.atan2(_dy, _dx) * (180 / Math.PI) + 90;
      this.rotation = direction;

      this.position.x = this.x;
      this.position.y = this.y;
    }

    public Update(): void {
      this._updatePosition();
      // this._checkBounds();
    }

    /**
     * destroy
     */
    public destroy(): void {
      this._reset();
    }
  }
}
