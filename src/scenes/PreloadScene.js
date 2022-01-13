import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    //this.load.image("birdy", "assets/bird.png");
    this.load.spritesheet("birdy", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("back", "assets/back.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.scene.start("MenuScene");
  }
}

export default PreloadScene;
