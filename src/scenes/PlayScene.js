import Phaser from "phaser";

const PIPES_TO_RENDER = 5;
class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.initialBirdPosition = {
      x: 80,
      y: 300,
    };
    this.bird = null;
    this.pipes = null;
    this.flapVelocity = 300;
    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistanceRange = [150, 200];
    this.pipeHorizontalDistanceRange = [450, 500];

    this.score = 0;
    this.scoreText = "";
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("birdy", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBackground();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBackground() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(
      this.config.startPosition.x,
      this.config.startPosition.y,
      "birdy"
    );
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "32px",
      fill: "#000",
    });
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);

    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }
  placePipe(uPipe, lPipe) {
    const rigthMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );

    const pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );

    uPipe.x = rigthMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }
  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.getBounds().top <= 0
    ) {
      this.gameOver();
    }
  }
  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
        }
      }
    });
  }

  getRightMostPipe() {
    let rigthMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rigthMostX = Math.max(pipe.x, rigthMostX);
    });

    return rigthMostX;
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;