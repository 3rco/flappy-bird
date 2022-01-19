import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 5;
class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.initialBirdPosition = {
      x: 80,
      y: 300,
    };
    this.bird = null;
    this.pipes = null;
    this.isPaused = false;
    this.flapVelocity = 300;
    this.pipeHorizontalDistance = 0;

    this.score = 0;
    this.scoreText = "";

    this.currentDifficulty = "easy";

    this.difficulties = {
      easy: {
        pipeVerticalDistanceRange: [150, 190],
        pipeHorizontalDistanceRange: [450, 500],
      },
      normal: {
        pipeVerticalDistanceRange: [125, 165],
        pipeHorizontalDistanceRange: [400, 450],
      },
      hard: {
        pipeVerticalDistanceRange: [100, 130],
        pipeHorizontalDistanceRange: [300, 400],
      },
    };
  }

  create() {
    this.currentDifficulty = "easy";
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenEvents();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("birdy", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    this.bird.play("fly");
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  listenEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(...this.screenCenter, this.initialTime, {
          fontSize: "50px",
          fill: "#FFF",
        })
        .setOrigin(0.5);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText(this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "birdy")
      .setFlipX(true)
      .setScale(3);

    this.bird.setBodySize(this.bird.width, this.bird.height - 8);

    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(800, 0, "pipe2")
        .setFlipY(true)
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
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "32px",
      fill: "#000",
    });
    this.bestScore = this.add.text(16, 52, `Best Score: ${bestScore || 0}`, {
      fontSize: "18px",
      fill: "#000",
    });
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);
    this.input.keyboard.on("keydown_P ", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);

    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }
  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rigthMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );

    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
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
          this.saveBestScore();
          this.changeDifficulty();
        }
      }
    });
  }

  changeDifficulty() {
    if (this.score === 5) {
      this.currentDifficulty = "normal";
    }
    if (this.score === 10) {
      this.currentDifficulty = "hard";
    }
  }

  getRightMostPipe() {
    let rigthMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rigthMostX = Math.max(pipe.x, rigthMostX);
    });

    return rigthMostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);
    this.saveBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.start("MenuScene");
      },
      loop: false,
    });
  }

  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
