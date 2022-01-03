import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.initialBirdPosition = {
      x: 80,
      y: 300,
    };
    this.bird = null;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("birdy", "assets/bird.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.bird = this.physics.add.sprite(
      this.config.startPosition.x,
      this.config.startPosition.y,
      "birdy"
    );
    this.bird.body.gravity.y = 500;
  }

  update() {}
}

export default PlayScene;
