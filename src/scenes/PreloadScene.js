import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("sky", "sky.png");
    //this.load.image("birdy", "assets/bird.png");
    this.load.spritesheet("birdy", "birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "pipe.png");
    this.load.image("pause", "pause.png");
    this.load.image("back", "back.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.scene.start("MenuScene");
  }
}

export default PreloadScene;
