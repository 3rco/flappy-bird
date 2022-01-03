import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
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
  scene: [new PlayScene(SHARED_CONFIG)],
};

const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };

const VELOCITY = 300;
const PIPES_TO_RENDER = 5;
let bird = null;
let pipes = null;

const pipeVerticalDistanceRange = [150, 200];
const pipeHorizontalDistanceRange = [450, 500];

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
  bird.body.gravity.y = 500;
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  this.input.on("pointerdown", flap);

  this.input.keyboard.on("keydown_SPACE", flap);
}

function update(time, delta) {
  if (bird.y > config.height) {
    restartBirdPosition();
  }

  recyclePipes();
}

function placePipe(uPipe, lPipe) {
  const rigthMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(
    ...pipeVerticalDistanceRange
  );
  const pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );

  const pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );

  uPipe.x = rigthMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach((pipe) => {
    if (pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  });
}

function flap() {
  bird.body.velocity.y = -VELOCITY;
}

function getRightMostPipe() {
  let rigthMostX = 0;

  pipes.getChildren().forEach(function (pipe) {
    rigthMostX = Math.max(pipe.x, rigthMostX);
  });

  return rigthMostX;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
