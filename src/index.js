import Phaser from "phaser";

const GRAVITY = 500;
const VELOCITY = 300;
let bird = null;
let upperPipe = null;
let lowerPipe = null;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      /* gravity: {
        y: GRAVITY,
      }, */
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("birdy", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  bird = this.physics.add.sprite(
    initialBirdPosition.x,
    initialBirdPosition.y,
    "birdy"
  );
  upperPipe = this.physics.add.sprite(400, 120, "pipe").setOrigin(0, 1);
  lowerPipe = this.physics.add
    .sprite(400, upperPipe.y + 100, "pipe")
    .setOrigin(0, 0);

  bird.body.gravity.y = GRAVITY;

  this.input.on("pointerdown", flap);

  this.input.keyboard.on("keydown_SPACE", flap);
}

function update(time, delta) {
  if (bird.y > config.height) {
    restartBirdPosition();
  }
}

function flap() {
  bird.body.velocity.y = -VELOCITY;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
